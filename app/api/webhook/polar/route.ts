// DealNote Polar webhook: POST /api/webhook/polar.
// Brand-new code for DealNote. No code copied from any other product.
//
// - Reads the RAW body and verifies the signature with the Polar SDK
//   (validateEvent from @polar-sh/sdk/2026-10, Standard Webhooks headers).
//   Bad signature -> 403. Missing POLAR_WEBHOOK_SECRET -> 503.
// - Dedupes on the `webhook-id` header: a replayed event is acknowledged
//   but not processed twice.
// - order.paid: stores the purchase (order id, customer id, product id,
//   amount) and, best-effort, looks up the licence key Polar granted to
//   that customer and stores its hash in the entitlement store. Polar
//   delivers the key itself to the buyer (email / customer portal); a key
//   is also provisioned lazily the first time it validates on /api/audit,
//   so a failed lookup here never blocks a paying customer.
// - order.refunded / refund.created: marks the purchase refunded and
//   revokes the licence record(s) for that customer.
// - Every other event type is acknowledged (200) and ignored.
//
// NOTE: this is the ONLY writer of entitlements from payments. The
// in-memory store resets on serverless cold starts (see lib/entitlements.ts);
// wire the KV adapter before treating the quota as a hard production limit.

import { NextResponse } from "next/server";
import { webhooks } from "@polar-sh/sdk/2026-10";
import { getPolarClient } from "@/lib/license";
import {
  entitlementStore,
  hashLicenseKey,
  newLicenseRecord,
} from "@/lib/entitlements";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Polar webhook secret is not configured on this build." },
      { status: 503 },
    );
  }

  const body = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event: Awaited<ReturnType<typeof webhooks.validateEvent>>;
  try {
    event = await webhooks.validateEvent(body, headers, secret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 403 });
  }

  // Dedupe on the Standard Webhooks message id.
  const eventId = request.headers.get("webhook-id") ?? "";
  if (eventId) {
    if (await entitlementStore.hasSeenEvent(eventId)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    await entitlementStore.markEventSeen(eventId);
  }

  try {
    if (event.type === "order.paid") {
      const order = event.data;
      const productId = process.env.POLAR_PRODUCT_ID;
      await entitlementStore.setPurchase({
        orderId: order.id,
        customerId: order.customer_id,
        productId: order.product_id,
        totalAmount: order.total_amount ?? null,
        currency: order.currency ?? null,
        status: "paid",
        paidAt: order.created_at,
      });

      // Licence-key provisioning, best-effort. Only for our product when
      // the product id is configured. The key is stored hashed, never raw.
      if (!productId || order.product_id === productId) {
        await provisionLicenseKeyForCustomer(order.customer_id).catch(() => {
          // Never fail the webhook on a lookup error: the key is also
          // provisioned lazily on first validation in /api/audit.
        });
      }
    } else if (event.type === "order.refunded") {
      const order = event.data;
      const purchase = await entitlementStore.getPurchase(order.id);
      if (purchase) {
        await entitlementStore.setPurchase({ ...purchase, status: "refunded" });
      }
      await entitlementStore.revokeByCustomerId(order.customer_id);
    } else if (event.type === "refund.created") {
      const refund = event.data;
      const orderId = (refund as { order_id?: string }).order_id;
      if (orderId) {
        const purchase = await entitlementStore.getPurchase(orderId);
        if (purchase) {
          await entitlementStore.setPurchase({ ...purchase, status: "refunded" });
          await entitlementStore.revokeByCustomerId(purchase.customerId);
        }
      }
    }
    // All other event types: acknowledged, no action.
  } catch {
    // A storage failure must not make Polar retry forever; the purchase
    // record can be reconciled from the Polar dashboard. Acknowledge.
    return NextResponse.json({ received: true, stored: false });
  }

  return NextResponse.json({ received: true });
}

/**
 * Find the granted licence key Polar issued to this customer and store
 * its hash. Lists granted keys for the organization (paged, 100 max)
 * and matches on customer_id. Returns false when no key is found yet
 * (e.g. the grant has not landed); the key is then provisioned lazily
 * on first validation instead.
 */
async function provisionLicenseKeyForCustomer(customerId: string): Promise<boolean> {
  const polar = getPolarClient();
  const organizationId = process.env.POLAR_ORGANIZATION_ID;
  if (!polar || !organizationId) return false;
  const page = await polar.licenseKeys.list({
    organization_id: organizationId,
    status: "granted",
    limit: 100,
  });
  const match = page.items.find((item) => item.customer_id === customerId);
  if (!match) return false;
  const existing = await entitlementStore.getByKeyHash(hashLicenseKey(match.key));
  if (!existing) {
    await entitlementStore.set(
      newLicenseRecord({
        keyHash: hashLicenseKey(match.key),
        keyId: match.id,
        email: match.customer?.email ?? undefined,
        customerId: match.customer_id,
      }),
    );
  }
  return true;
}
