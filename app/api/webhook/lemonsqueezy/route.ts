// DealNote Lemon Squeezy webhook: POST /api/webhook/lemonsqueezy.
// Brand-new code for DealNote. No code copied from any other product.
//
// - Reads the RAW body and verifies the X-Signature header (hex
//   HMAC-SHA256 of the raw body with LEMONSQUEEZY_WEBHOOK_SECRET).
//   Bad signature -> 401. Missing secret -> 503.
// - Event name is in meta.event_name. Dedupes on
//   `ls:<event_name>:<order id>`: a replayed event is acknowledged
//   but not processed twice.
// - order_created: stores the purchase (order id, customer id,
//   product/variant id, amount) and, best-effort, looks up the
//   license key Lemon Squeezy generated for that order and stores
//   its hash in the entitlement store. Lemon Squeezy emails the key
//   to the buyer in the receipt; a key is also provisioned lazily
//   the first time it validates on /api/audit, so a failed lookup
//   here never blocks a paying customer.
// - order_refunded: marks the purchase refunded and revokes the
//   license record(s) for that customer / order.
// - Every other event type is acknowledged (200) and ignored.
//
// NOTE: this is the ONLY writer of entitlements from payments. The
// in-memory store resets on serverless cold starts (see
// lib/entitlements.ts); wire the KV adapter before treating the
// quota as a hard production limit.

import { NextResponse } from "next/server";
import {
  getLicenseKeyForOrder,
  lemonSqueezyEnv,
  verifyLemonSqueezyWebhookSignature,
} from "@/lib/lemonsqueezy";
import {
  entitlementStore,
  hashLicenseKey,
  newLicenseRecord,
} from "@/lib/entitlements";

export const runtime = "nodejs";

interface LemonSqueezyWebhookBody {
  meta?: { event_name?: string; custom_data?: Record<string, unknown> };
  data?: {
    id?: string;
    type?: string;
    attributes?: {
      store_id?: number;
      customer_id?: number;
      order_number?: number;
      user_name?: string;
      user_email?: string;
      total?: number;
      currency?: string;
      status?: string;
      first_order_item?: {
        product_id?: number;
        variant_id?: number;
        product_name?: string;
        variant_name?: string;
      };
    };
  };
}

export async function POST(request: Request) {
  const secret = lemonSqueezyEnv().webhookSecret;
  if (!secret) {
    return NextResponse.json(
      { error: "Lemon Squeezy webhook secret is not configured on this build." },
      { status: 503 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("x-signature");
  if (!verifyLemonSqueezyWebhookSignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: LemonSqueezyWebhookBody;
  try {
    payload = JSON.parse(body) as LemonSqueezyWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid webhook body." }, { status: 400 });
  }

  const eventName = payload.meta?.event_name ?? "";
  const orderId = payload.data?.id ?? "";
  const attrs = payload.data?.attributes ?? {};

  // Dedupe on event + order id.
  const eventId = orderId ? `ls:${eventName}:${orderId}` : "";
  if (eventId) {
    if (await entitlementStore.hasSeenEvent(eventId)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    await entitlementStore.markEventSeen(eventId);
  }

  try {
    if (eventName === "order_created") {
      const productId = lemonSqueezyEnv().productId;
      const itemProductId =
        attrs.first_order_item?.product_id !== undefined
          ? String(attrs.first_order_item.product_id)
          : null;
      await entitlementStore.setPurchase({
        orderId: orderId || String(attrs.order_number ?? ""),
        customerId: attrs.customer_id !== undefined ? String(attrs.customer_id) : "",
        productId: itemProductId,
        totalAmount: attrs.total ?? null,
        currency: attrs.currency ?? null,
        email: attrs.user_email ?? undefined,
        status: "paid",
        paidAt: new Date().toISOString(),
      });

      // License-key provisioning, best-effort. Only for our product
      // when the product id is configured. The key is stored hashed,
      // never raw.
      if (!productId || !itemProductId || itemProductId === productId) {
        await provisionLicenseKeyForOrder(orderId, attrs).catch(() => {
          // Never fail the webhook on a lookup error: the key is also
          // provisioned lazily on first validation in /api/audit.
        });
      }
    } else if (eventName === "order_refunded") {
      const purchaseOrderId = orderId || String(attrs.order_number ?? "");
      const purchase = purchaseOrderId
        ? await entitlementStore.getPurchase(purchaseOrderId)
        : null;
      if (purchase) {
        await entitlementStore.setPurchase({ ...purchase, status: "refunded" });
      }
      if (attrs.customer_id !== undefined) {
        await entitlementStore.revokeByCustomerId(String(attrs.customer_id));
      }
      // Also revoke by the stored license key for this order, if any.
      const key = orderId ? await getLicenseKeyForOrder(orderId).catch(() => null) : null;
      if (key) await entitlementStore.revokeByKeyHash(hashLicenseKey(key));
    }
    // All other event types: acknowledged, no action.
  } catch {
    // A storage failure must not make Lemon Squeezy retry forever;
    // the purchase record can be reconciled from the Lemon Squeezy
    // dashboard. Acknowledge.
    return NextResponse.json({ received: true, stored: false });
  }

  return NextResponse.json({ received: true });
}

/**
 * Find the license key Lemon Squeezy generated for this order and
 * store its hash. Returns false when no key is found yet (e.g. the
 * grant has not landed); the key is then provisioned lazily on
 * first validation instead.
 */
async function provisionLicenseKeyForOrder(
  orderId: string,
  attrs: NonNullable<LemonSqueezyWebhookBody["data"]>["attributes"],
): Promise<boolean> {
  if (!orderId) return false;
  const key = await getLicenseKeyForOrder(orderId);
  if (!key) return false;
  await entitlementStore.set(
    newLicenseRecord({
      keyHash: hashLicenseKey(key),
      email: attrs?.user_email ?? undefined,
      customerId: attrs?.customer_id !== undefined ? String(attrs.customer_id) : undefined,
      orderId,
    }),
  );
  return true;
}
