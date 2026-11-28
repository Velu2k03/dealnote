// DealNote KV client: Upstash Redis via env, memory fallback when unset.
// Code-ready only: no Upstash/Vercel account is provisioned here and no
// dashboard access is needed. When UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN are set (Vercel env), the entitlement store
// and rate limiter use Redis and survive cold starts; otherwise they fall
// back to the in-memory stores, which are best-effort per instance.

import { Redis } from "@upstash/redis";

export function isKvConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

let redisClient: Redis | null | undefined;

export function getRedisClient(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  if (!isKvConfigured()) {
    redisClient = null;
    return null;
  }
  try {
    redisClient = Redis.fromEnv();
  } catch {
    redisClient = null;
  }
  return redisClient;
}

/** Parse a KV value that may be a JSON string or an already-parsed object. */
export function parseKvValue<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  return value as T;
}
