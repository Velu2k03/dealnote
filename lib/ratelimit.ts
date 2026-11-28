// DealNote rate limiting: free-tier IP limit for /api/audit.
// Brand-new code for DealNote. No code copied from any other product.
//
// Free tier: 5 audit requests per IP per hour. Paid licence-key requests
// are exempt from this IP limit (they are counted against the 30/month
// licence quota instead, in lib/entitlements.ts).
//
// KV-backed when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are
// set (Upstash Redis INCR with a 1-hour expiry, shared across Vercel
// instances and cold starts); otherwise the in-memory map below, which is
// best-effort per instance. That fallback is acceptable for a free-tier
// throttle; it must not be treated as a billing control. The map lives on
// globalThis so Next.js route bundles in one server process share it (each
// route is bundled separately, so a plain module-level Map would be per-route).

import { getRedisClient } from "@/lib/kv";

export const FREE_AUDITS_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;

interface WindowEntry {
  count: number;
  windowStart: number;
}

const rateLimitGlobal = globalThis as unknown as { __dealnoteRateWindows?: Map<string, WindowEntry> };
const windows: Map<string, WindowEntry> =
  rateLimitGlobal.__dealnoteRateWindows ??= new Map<string, WindowEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Unix ms when the current window resets. */
  resetAt: number;
}

/** Best-effort client IP: first x-forwarded-for entry, then x-real-ip.
 *  Note: X-Forwarded-For is client-supplied and can be rotated, so this
 *  limit is a throttle, not a security boundary. On Vercel the platform
 *  sets X-Forwarded-For; a single spoofed entry cannot be distinguished
 *  from the real chain without trusting the platform header. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Check (and, when allowed, count) one free-tier audit for this IP.
 * In-memory version; kept for unit tests and as the fallback path.
 * Returns allowed:false once the IP has used 5 audits in the current hour.
 */
export function checkFreeRateLimit(ip: string, now: number = Date.now()): RateLimitResult {
  const entry = windows.get(ip);
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    windows.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: FREE_AUDITS_PER_HOUR - 1, resetAt: now + WINDOW_MS };
  }
  if (entry.count >= FREE_AUDITS_PER_HOUR) {
    return { allowed: false, remaining: 0, resetAt: entry.windowStart + WINDOW_MS };
  }
  entry.count += 1;
  return { allowed: true, remaining: FREE_AUDITS_PER_HOUR - entry.count, resetAt: entry.windowStart + WINDOW_MS };
}

/**
 * KV-backed check (preferred in production). Uses Redis INCR on
 * `dealnote:ratelimit:<ip>` with a 1-hour expiry set on first use, so
 * the count survives cold starts and is shared between instances.
 * Falls back to the in-memory check when Redis is not configured or
 * errors, so a Redis outage never blocks the free audit entirely.
 */
export async function checkFreeRateLimitAsync(ip: string, now: number = Date.now()): Promise<RateLimitResult> {
  const redis = getRedisClient();
  if (!redis) return checkFreeRateLimit(ip, now);
  const key = `dealnote:ratelimit:${ip}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 60 * 60);
    }
    if (count > FREE_AUDITS_PER_HOUR) {
      const ttl = await redis.ttl(key);
      const resetAt = now + (ttl > 0 ? ttl * 1000 : WINDOW_MS);
      return { allowed: false, remaining: 0, resetAt };
    }
    return {
      allowed: true,
      remaining: FREE_AUDITS_PER_HOUR - count,
      resetAt: now + WINDOW_MS,
    };
  } catch {
    return checkFreeRateLimit(ip, now);
  }
}
