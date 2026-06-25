// Simple sliding-window rate limiter using an in-process Map.
//
// PRODUCTION NOTE: This works correctly for single-process deployments but
// does NOT share state across serverless function instances (e.g. multiple
// Vercel regions or concurrent lambda invocations). For production, replace
// the store with @vercel/kv or Upstash Redis so limits are enforced globally.

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

// Clean up expired entries every 5 minutes to prevent unbounded memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) {
      if (now > v.resetAt) store.delete(k);
    }
  }, 5 * 60_000);
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check whether `key` is within its allowed rate.
 * @param key      Unique key (e.g. `login:${ip}` or `contact:${ip}`)
 * @param limit    Max requests per window (default 10)
 * @param windowMs Window length in ms (default 60 s)
 */
export function checkRateLimit(
  key: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  entry.count += 1;
  return {
    ok: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  };
}

/** Extract the real client IP from request headers (Vercel / standard proxies). */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
