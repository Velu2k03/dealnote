// DealNote licence-key validation (Polar.sh, server-side only).
// Brand-new code for DealNote. No code copied from any other product.
//
// Two modes:
// 1. Polar configured (POLAR_ACCESS_TOKEN + POLAR_ORGANIZATION_ID set):
//    the key is validated against Polar's licence-key API. The raw key is
//    sent to Polar only, over HTTPS, and is never logged or stored.
// 2. Polar NOT configured: ONLY the dev key in DEALNOTE_DEV_LICENSE_KEY is
//    accepted. This is local-test-only. No key is hardcoded anywhere in
//    this repo; without that env var, every key is rejected.
//
// The Polar SDK is versioned by API version: this file uses
// `@polar-sh/sdk/2026-10` (installed @polar-sh/sdk 1.3.3, MIT).

import { createPolar, type Polar } from "@polar-sh/sdk/2026-10";
import { timingSafeEqual } from "crypto";

export type LicenseValidation =
  | { valid: true; keyId: string; email?: string; customerId?: string; source: "polar" | "dev" }
  | { valid: false; reason: string };

export function isPolarConfigured(): boolean {
  return Boolean(process.env.POLAR_ACCESS_TOKEN && process.env.POLAR_ORGANIZATION_ID);
}

let polarClient: Polar | null = null;

/** Shared Polar client (server-only). Returns null when Polar is not configured. */
export function getPolarClient(): Polar | null {
  if (!process.env.POLAR_ACCESS_TOKEN) return null;
  if (!polarClient) {
    polarClient = createPolar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      // "sandbox" only when POLAR_SERVER=sandbox is set explicitly;
      // production is the default.
      environment: process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
    });
  }
  return polarClient;
}

function timingSafeKeyEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Validate a licence key server-side.
 * - Polar configured: `polar.licenseKeys.validate({ key, organization_id })`.
 *   A granted key returns valid with its Polar id, buyer email and
 *   customer id. Any SDK error (unknown key, revoked, expired, network
 *   failure) returns { valid: false } with a plain reason; SDK internals
 *   are never leaked to the caller.
 * - Polar not configured: only DEALNOTE_DEV_LICENSE_KEY is accepted
 *   (local-test-only). Anything else, including an empty key, is invalid.
 */
export async function validateLicenseKey(rawKey: string): Promise<LicenseValidation> {
  const key = (rawKey ?? "").trim();
  if (!key) return { valid: false, reason: "Enter a licence key." };

  const polar = getPolarClient();
  if (polar && process.env.POLAR_ORGANIZATION_ID) {
    try {
      const result = await polar.licenseKeys.validate({
        key,
        organization_id: process.env.POLAR_ORGANIZATION_ID,
      });
      // The SDK returns a ValidatedLicenseKey with status "granted" on
      // success and throws on unknown / revoked / expired keys.
      return {
        valid: true,
        keyId: result.id,
        email: result.customer?.email ?? undefined,
        customerId: result.customer_id ?? undefined,
        source: "polar",
      };
    } catch {
      return { valid: false, reason: "That licence key was not recognised. Check it and try again." };
    }
  }

  // Local-test-only fallback. No hardcoded key: the dev key comes from
  // DEALNOTE_DEV_LICENSE_KEY and must never be shipped as a real licence.
  const devKey = process.env.DEALNOTE_DEV_LICENSE_KEY;
  if (devKey && timingSafeKeyEqual(key, devKey)) {
    return { valid: true, keyId: "dev", source: "dev" };
  }
  return { valid: false, reason: "Licence keys are not configured on this build yet. That key was not recognised." };
}
