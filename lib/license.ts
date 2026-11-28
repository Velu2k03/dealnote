// DealNote license-key validation (Lemon Squeezy, server-side only).
// Brand-new code for DealNote. No code copied from any other product.
//
// Two modes:
// 1. Lemon Squeezy configured (LEMONSQUEEZY_STORE_ID / PRODUCT_ID /
//    VARIANT_ID set): the key is validated against Lemon Squeezy's
//    public License API. The raw key is sent to Lemon Squeezy only,
//    over HTTPS, and is never logged or stored. The key must belong to
//    this store / product / variant (checked in lib/lemonsqueezy.ts).
// 2. Lemon Squeezy NOT configured: ONLY the dev key in
//    DEALNOTE_DEV_LICENSE_KEY is accepted. This is local-test-only. No
//    key is hardcoded anywhere in this repo; without that env var,
//    every key is rejected.
//
// Lemon Squeezy generates the license key itself (license keys enabled
// on the product) and emails it to the buyer in the receipt, so there
// is no key generation or storage of raw keys on DealNote's side.

import { validateLemonSqueezyLicenseKey } from "./lemonsqueezy";

export type LicenseValidation =
  | { valid: true; keyId: string; email?: string; customerId?: string; orderId?: string; source: "lemonsqueezy" | "dev" }
  | { valid: false; reason: string };

function timingSafeKeyEqual(a: string, b: string): boolean {
  // Constant-time compare without importing crypto's timingSafeEqual
  // for different-length inputs (it throws on length mismatch).
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) diff |= bufA[i] ^ bufB[i];
  return diff === 0;
}

/**
 * Validate a license key server-side.
 * - Lemon Squeezy configured: validated against the License API.
 *   An active key returns valid with its Lemon Squeezy id, buyer
 *   email, customer id and order id. Anything else returns
 *   { valid: false } with a plain reason; API internals are never
 *   leaked to the caller.
 * - Lemon Squeezy not configured: only DEALNOTE_DEV_LICENSE_KEY is
 *   accepted (local-test-only). Anything else, including an empty
 *   key, is invalid.
 */
export async function validateLicenseKey(rawKey: string): Promise<LicenseValidation> {
  const key = (rawKey ?? "").trim();
  if (!key) return { valid: false, reason: "Enter a license key." };

  const ls = await validateLemonSqueezyLicenseKey(key);
  if (ls.valid) {
    return {
      valid: true,
      keyId: ls.keyId ?? "lemonsqueezy",
      ...(ls.email ? { email: ls.email } : {}),
      ...(ls.customerId ? { customerId: ls.customerId } : {}),
      ...(ls.orderId ? { orderId: ls.orderId } : {}),
      source: "lemonsqueezy",
    };
  }
  // If Lemon Squeezy is not configured at all, the validate call
  // above returns "not recognised" for every key; fall through to
  // the dev-key check so local testing still works. When Lemon
  // Squeezy IS configured, a failed validation is final, except
  // that the dev key is never accepted in production builds.
  const devKey = process.env.DEALNOTE_DEV_LICENSE_KEY;
  const lsConfigured = Boolean(
    process.env.LEMONSQUEEZY_STORE_ID && process.env.LEMONSQUEEZY_VARIANT_ID,
  );
  if (!lsConfigured && devKey && timingSafeKeyEqual(key, devKey)) {
    return { valid: true, keyId: "dev", source: "dev" };
  }
  if (ls.valid === false && ls.reason) return { valid: false, reason: ls.reason };
  return { valid: false, reason: "That license key was not recognised. Check it and try again." };
}
