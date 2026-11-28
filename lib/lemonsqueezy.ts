// DealNote Lemon Squeezy client (server-side only).
// Brand-new code for DealNote. No code copied from any other product.
//
// Lemon Squeezy is the merchant of record: it handles the $49 one-time
// payment, sales tax, and the licence key. DealNote never collects or
// sees card data.
//
// Endpoints used (Lemon Squeezy API v1, docs.lemonsqueezy.com):
// - POST /v1/checkouts — create a hosted checkout, returns attributes.url.
// - POST /v1/licenses/validate — public License API, form-encoded,
//   no API key needed; returns { valid, license_key, meta }.
// - GET /v1/license-keys?filter[order_id]=... — list the key(s) Lemon
//   Squeezy generated for an order (needs the API key).
// Webhook signature: X-Signature is the hex HMAC-SHA256 of the raw body
// with the webhook signing secret. Verified in the webhook route.
//
// Env vars (server-only, set in Vercel; never commit values):
//   LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID,
//   LEMONSQUEEZY_PRODUCT_ID, LEMONSQUEEZY_VARIANT_ID,
//   LEMONSQUEEZY_WEBHOOK_SECRET
// The product must have licence keys enabled, so every paid order gets
// a key that Lemon Squeezy emails to the buyer in the receipt.

import { createHmac, timingSafeEqual } from "crypto";

const LS_API = "https://api.lemonsqueezy.com/v1";

export function lemonSqueezyEnv(): {
  apiKey: string;
  storeId: string;
  productId: string;
  variantId: string;
  webhookSecret: string;
} {
  return {
    apiKey: process.env.LEMONSQUEEZY_API_KEY ?? "",
    storeId: process.env.LEMONSQUEEZY_STORE_ID ?? "",
    productId: process.env.LEMONSQUEEZY_PRODUCT_ID ?? "",
    variantId: process.env.LEMONSQUEEZY_VARIANT_ID ?? "",
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "",
  };
}

/** True when checkout can be created (API key + store + variant set). */
export function isLemonSqueezyConfigured(): boolean {
  const env = lemonSqueezyEnv();
  return Boolean(env.apiKey && env.storeId && env.variantId);
}

export interface LemonSqueezyCheckout {
  url: string;
  checkoutId: string;
}

/**
 * Create a hosted Lemon Squeezy checkout for the $49 one-time variant.
 * Returns the checkout URL the buyer is sent to, and the checkout id.
 * Throws on any API failure; the caller maps that to a plain 502.
 */
export async function createLemonSqueezyCheckout(input: {
  email?: string;
  origin: string;
}): Promise<LemonSqueezyCheckout> {
  const env = lemonSqueezyEnv();
  const storeId = Number(env.storeId);
  const variantId = Number(env.variantId);
  if (!env.apiKey || !storeId || !variantId) {
    throw new Error("Lemon Squeezy is not configured.");
  }

  const res = await fetch(`${LS_API}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${env.apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          store_id: storeId,
          variant_id: variantId,
          checkout_data: {
            ...(input.email ? { email: input.email } : {}),
          },
          product_options: {
            redirect_url: `${input.origin}/audit?checkout=success`,
            receipt_button_text: "Open DealNote",
            receipt_thank_you_note:
              "Your licence key is in your receipt email. Enter it on the audit page to unlock the full report and PDF downloads.",
          },
        },
        relationships: {
          store: { data: { type: "stores", id: String(storeId) } },
          variant: { data: { type: "variants", id: String(variantId) } },
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Lemon Squeezy checkout failed: HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    data?: { id?: string; attributes?: { url?: string } };
  };
  const url = json.data?.attributes?.url ?? "";
  const checkoutId = json.data?.id ?? "";
  if (!url) throw new Error("Lemon Squeezy checkout returned no URL.");
  return { url, checkoutId };
}

export interface LemonSqueezyLicenseValidation {
  valid: boolean;
  keyId?: string;
  email?: string;
  customerId?: string;
  orderId?: string;
  reason?: string;
}

/**
 * Validate a Lemon Squeezy licence key against the public License API.
 * The key is sent to Lemon Squeezy only, over HTTPS, and is never
 * logged or stored. The returned meta ids are checked against the
 * configured store / product / variant, so a key from another Lemon
 * Squeezy product cannot unlock DealNote.
 */
export async function validateLemonSqueezyLicenseKey(
  rawKey: string,
): Promise<LemonSqueezyLicenseValidation> {
  const key = (rawKey ?? "").trim();
  if (!key) return { valid: false, reason: "Enter a licence key." };

  let res: Response;
  try {
    res = await fetch(`${LS_API}/licenses/validate`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ license_key: key }),
    });
  } catch {
    return { valid: false, reason: "The licence check could not be reached. Try again in a moment." };
  }
  let json: {
    valid?: boolean;
    error?: string | null;
    license_key?: { id?: number; status?: string; key?: string };
    meta?: {
      store_id?: number;
      order_id?: number;
      product_id?: number;
      variant_id?: number;
      customer_id?: number;
      customer_email?: string;
    };
  };
  try {
    json = (await res.json()) as typeof json;
  } catch {
    return { valid: false, reason: "The licence check returned an unreadable reply. Try again in a moment." };
  }

  if (!json.valid || json.license_key?.status !== "active") {
    return { valid: false, reason: "That licence key was not recognised. Check it and try again." };
  }
  const env = lemonSqueezyEnv();
  const meta = json.meta ?? {};
  // When ids are configured, the key must belong to this store/product.
  // (Ids are numbers in the API; env values are strings, so compare as strings.)
  if (env.storeId && meta.store_id !== undefined && String(meta.store_id) !== env.storeId) {
    return { valid: false, reason: "That licence key was not recognised. Check it and try again." };
  }
  if (env.productId && meta.product_id !== undefined && String(meta.product_id) !== env.productId) {
    return { valid: false, reason: "That licence key was not recognised. Check it and try again." };
  }
  if (env.variantId && meta.variant_id !== undefined && String(meta.variant_id) !== env.variantId) {
    return { valid: false, reason: "That licence key was not recognised. Check it and try again." };
  }
  return {
    valid: true,
    keyId: json.license_key?.id !== undefined ? String(json.license_key.id) : undefined,
    email: meta.customer_email ?? undefined,
    customerId: meta.customer_id !== undefined ? String(meta.customer_id) : undefined,
    orderId: meta.order_id !== undefined ? String(meta.order_id) : undefined,
  };
}

/**
 * List the licence key(s) Lemon Squeezy generated for an order.
 * Needs the API key. Returns the first key string, or null.
 */
export async function getLicenseKeyForOrder(orderId: string): Promise<string | null> {
  const env = lemonSqueezyEnv();
  if (!env.apiKey || !orderId) return null;
  try {
    const res = await fetch(
      `${LS_API}/license-keys?filter[order_id]=${encodeURIComponent(orderId)}`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${env.apiKey}`,
        },
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: Array<{ attributes?: { key?: string } }>;
    };
    return json.data?.[0]?.attributes?.key ?? null;
  } catch {
    return null;
  }
}

/**
 * Verify a Lemon Squeezy webhook signature: X-Signature is the hex
 * HMAC-SHA256 of the raw request body with the signing secret.
 */
export function verifyLemonSqueezyWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || !secret) return false;
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const sig = signature.trim().toLowerCase();
  if (sig.length !== digest.length) return false;
  return timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
}
