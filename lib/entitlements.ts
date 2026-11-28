// DealNote entitlements: license-key records and the 30-audits-per-month quota.
// Brand-new code for DealNote. No code copied from any other product.
//
// Storage note: the store resolves to the KV adapter
// (createKvEntitlementStore, Upstash Redis) when UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN are set, and falls back to the in-memory
// store below when they are not. The in-memory fallback is correct per
// server instance, but on Vercel serverless functions it resets on cold
// start and is not shared between instances, so a license key's usage
// count is best-effort there and the quota is presented as a fair-use
// limit, not a hard cap, until KV is configured. No account or service
// is provisioned by this code; set the env vars in Vercel to enable it.

import { createHash } from "crypto";
import { getRedisClient, parseKvValue } from "@/lib/kv";

export const AUDITS_PER_MONTH = 30;

export interface LicenseRecord {
  /** SHA-256 hex of the license key. The raw key is never stored. */
  keyHash: string;
  /** Lemon Squeezy license key id, when known (from validation or the webhook). */
  keyId?: string;
  /** Buyer email, when known. */
  email?: string;
  /** Lemon Squeezy customer id, when known. Used to revoke on refund. */
  customerId?: string;
  /** Lemon Squeezy order id that paid for this license, when known. */
  orderId?: string;
  /** Audits used in `month`. */
  auditsUsed: number;
  /** Calendar month the counter belongs to, "YYYY-MM" (UTC). */
  month: string;
  createdAt: string;
  /** Set when the purchase was refunded. Revoked keys validate as invalid. */
  revoked?: boolean;
}

export interface PurchaseRecord {
  orderId: string;
  customerId: string;
  productId: string | null;
  totalAmount: number | null;
  currency: string | null;
  email?: string;
  status: "paid" | "refunded";
  paidAt: string;
}

export interface EntitlementStore {
  getByKeyHash(keyHash: string): Promise<LicenseRecord | null>;
  set(record: LicenseRecord): Promise<void>;
  revokeByKeyHash(keyHash: string): Promise<void>;
  revokeByCustomerId(customerId: string): Promise<void>;
  getPurchase(orderId: string): Promise<PurchaseRecord | null>;
  setPurchase(purchase: PurchaseRecord): Promise<void>;
  /** Webhook dedupe: has this Lemon Squeezy event already been processed? */
  hasSeenEvent(eventId: string): Promise<boolean>;
  markEventSeen(eventId: string): Promise<void>;
}

/** Current calendar month, "YYYY-MM" (UTC). Quota resets on the month. */
export function currentMonth(now: Date = new Date()): string {
  return now.toISOString().slice(0, 7);
}

/** SHA-256 hex of a license key. Used as the store key; raw keys are never stored. */
export function hashLicenseKey(key: string): string {
  return createHash("sha256").update(key.trim()).digest("hex");
}

/** Fresh record for a newly validated key. */
export function newLicenseRecord(input: {
  keyHash: string;
  keyId?: string;
  email?: string;
  customerId?: string;
  orderId?: string;
}): LicenseRecord {
  return {
    ...input,
    auditsUsed: 0,
    month: currentMonth(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Check quota without consuming: returns remaining audits for this record
 * in the current month (0 when the month rolled over the counter is reset
 * first, so a fresh month always shows the full quota).
 */
export function remainingAudits(record: LicenseRecord, now: Date = new Date()): number {
  if (record.revoked) return 0;
  if (record.month !== currentMonth(now)) return AUDITS_PER_MONTH;
  return Math.max(0, AUDITS_PER_MONTH - record.auditsUsed);
}

/**
 * Consume one audit against the record. Resets the counter when the
 * calendar month has rolled over. Returns false (and does not consume)
 * when the key is revoked or the monthly quota is exhausted.
 */
export function tryConsumeAudit(record: LicenseRecord, now: Date = new Date()): boolean {
  if (record.revoked) return false;
  if (record.month !== currentMonth(now)) {
    record.month = currentMonth(now);
    record.auditsUsed = 0;
  }
  if (record.auditsUsed >= AUDITS_PER_MONTH) return false;
  record.auditsUsed += 1;
  return true;
}

/** In-memory store. One instance per server process; see the header note. */
export function createMemoryEntitlementStore(): EntitlementStore {
  const licenses = new Map<string, LicenseRecord>();
  const purchases = new Map<string, PurchaseRecord>();
  const seenEvents = new Set<string>();

  return {
    async getByKeyHash(keyHash) {
      return licenses.get(keyHash) ?? null;
    },
    async set(record) {
      licenses.set(record.keyHash, record);
    },
    async revokeByKeyHash(keyHash) {
      const rec = licenses.get(keyHash);
      if (rec) licenses.set(keyHash, { ...rec, revoked: true });
    },
    async revokeByCustomerId(customerId) {
      for (const [hash, rec] of licenses) {
        if (rec.customerId === customerId) {
          licenses.set(hash, { ...rec, revoked: true });
        }
      }
    },
    async getPurchase(orderId) {
      return purchases.get(orderId) ?? null;
    },
    async setPurchase(purchase) {
      purchases.set(purchase.orderId, purchase);
    },
    async hasSeenEvent(eventId) {
      return seenEvents.has(eventId);
    },
    async markEventSeen(eventId) {
      seenEvents.add(eventId);
    },
  };
}

/**
 * Minimal key-value client shape, matching Vercel KV / Upstash Redis
 * (`get` / `set` / `del` on string keys). Pass a real client in; this
 * module imports no vendor SDK and holds no credentials.
 */
export interface KvClient {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: string): Promise<unknown>;
  del(key: string): Promise<unknown>;
}

/**
 * KV-backed entitlement store. Keys are namespaced under `dealnote:`.
 * Wire it by passing the project's KV client, e.g. Upstash Redis
 * (`@upstash/redis`, Vercel KV is sunset and `@vercel/kv` is deprecated):
 *   import { Redis } from "@upstash/redis";
 *   const redis = Redis.fromEnv();
 *   export const entitlementStore = createKvEntitlementStore(redis);
 * (The Redis import and binding live in the route that wires it,
 * not here, so this module stays vendor-free.)
 */
export function createKvEntitlementStore(kv: KvClient): EntitlementStore {
  const licenseKey = (hash: string) => `dealnote:license:${hash}`;
  const purchaseKey = (orderId: string) => `dealnote:purchase:${orderId}`;
  const eventKey = (eventId: string) => `dealnote:event:${eventId}`;
  // KV has no list-by-value, so customer -> key-hash links are stored
  // explicitly when a record carries a customerId.
  const customerKey = (customerId: string) => `dealnote:customer:${customerId}`;

  return {
    async getByKeyHash(keyHash) {
      return parseKvValue<LicenseRecord>(await kv.get(licenseKey(keyHash)));
    },
    async set(record) {
      await kv.set(licenseKey(record.keyHash), JSON.stringify(record));
      if (record.customerId) {
        await kv.set(customerKey(record.customerId), record.keyHash);
      }
    },
    async revokeByKeyHash(keyHash) {
      const rec = parseKvValue<LicenseRecord>(await kv.get(licenseKey(keyHash)));
      if (rec) await kv.set(licenseKey(keyHash), JSON.stringify({ ...rec, revoked: true }));
    },
    async revokeByCustomerId(customerId) {
      const hash = parseKvValue<string>(await kv.get(customerKey(customerId)));
      if (hash) await this.revokeByKeyHash(hash);
    },
    async getPurchase(orderId) {
      return parseKvValue<PurchaseRecord>(await kv.get(purchaseKey(orderId)));
    },
    async setPurchase(purchase) {
      await kv.set(purchaseKey(purchase.orderId), JSON.stringify(purchase));
    },
    async hasSeenEvent(eventId) {
      return (await kv.get(eventKey(eventId))) !== null;
    },
    async markEventSeen(eventId) {
      await kv.set(eventKey(eventId), "1");
    },
  };
}

/** The store: KV-backed (Upstash Redis) when UPSTASH_REDIS_REST_URL and
 *  UPSTASH_REDIS_REST_TOKEN are set, otherwise the in-memory store.
 *  The in-memory fallback is best-effort on Vercel serverless (resets on
 *  cold start, not shared between instances), so the 30-audit monthly
 *  figure is presented as a fair-use limit, not a hard cap, until KV is
 *  configured. See .env.example for the env vars to set in Vercel. */
function resolveEntitlementStore(): EntitlementStore {
  const redis = getRedisClient();
  if (redis) return createKvEntitlementStore(redis);
  return createMemoryEntitlementStore();
}

const storeGlobal = globalThis as unknown as { __dealnoteEntitlementStore?: EntitlementStore };
export const entitlementStore: EntitlementStore =
  storeGlobal.__dealnoteEntitlementStore ??= resolveEntitlementStore();

/** True when the entitlement store is the durable KV store. */
export function isEntitlementStoreDurable(): boolean {
  return getRedisClient() !== null;
}
