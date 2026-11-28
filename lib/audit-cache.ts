// DealNote last-audit cache: a PDF download must NOT re-run the audit
// and burn one of the 30 monthly audits. After a paid audit succeeds,
// its result is cached per license-key hash + normalised URL; the PDF
// routes reuse the cached result instead of calling runPaidAudit again.
// KV-backed (Upstash Redis, 24 h expiry) when configured, otherwise an
// in-memory Map (best-effort per instance, same fallback as entitlements).
// The cache never grants access: PDF routes still validate the license
// key and check revocation before reading it.

import { getRedisClient, parseKvValue } from "@/lib/kv";
import type { AuditResult } from "@/lib/audit";

const CACHE_TTL_SECONDS = 24 * 60 * 60;

interface CachedAudit {
  result: AuditResult;
  cachedAt: string;
}

const cacheGlobal = globalThis as unknown as { __dealnoteAuditCache?: Map<string, CachedAudit> };
const memoryCache: Map<string, CachedAudit> =
  cacheGlobal.__dealnoteAuditCache ??= new Map<string, CachedAudit>();

export function auditCacheKey(keyHash: string, url: string): string {
  return `dealnote:last-audit:${keyHash}:${url}`;
}

export async function getCachedAudit(keyHash: string, url: string): Promise<AuditResult | null> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const raw = await redis.get(auditCacheKey(keyHash, url));
      const parsed = parseKvValue<CachedAudit>(raw);
      return parsed?.result ?? null;
    } catch {
      // Fall through to the memory cache on a Redis error.
    }
  }
  return memoryCache.get(auditCacheKey(keyHash, url))?.result ?? null;
}

export async function setCachedAudit(
  keyHash: string,
  url: string,
  result: AuditResult,
): Promise<void> {
  const entry: CachedAudit = { result, cachedAt: new Date().toISOString() };
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(auditCacheKey(keyHash, url), JSON.stringify(entry), {
        ex: CACHE_TTL_SECONDS,
      });
      return;
    } catch {
      // Fall through to the memory cache on a Redis error.
    }
  }
  memoryCache.set(auditCacheKey(keyHash, url), entry);
}
