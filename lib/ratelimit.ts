// DealNote rate limiting: free-tier IP limit for /api/audit.
// Brand-new code for DealNote. No code copied from any other product.
//
// Free tier: 5 audit requests per IP per hour. Paid licence-key requests
// are exempt from this IP limit (they are counted against the 30/month
// licence quota instead, in lib/entitlements.ts).
//
// In-memory, best-effort: correct per server instance, but on Vercel
// serverless functions the counters reset on cold start and are not shared
// between instances. That is acceptable for a free-tier throttle; it must
// not be treated as a billing control. The map lives on globalThis so
// Next.js route bundles in one server process share it (each route is
// bundled separately, so a plain module-level Map would be per-route).

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

/** Best-effort client IP: first x-forwarded-for entry, then x-real-ip. */
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
