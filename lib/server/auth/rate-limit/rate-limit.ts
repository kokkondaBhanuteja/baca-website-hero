import 'server-only'

/**
 * Tiny in-process per-key sliding-window rate limiter. Suitable for blocking
 * naive credential-stuffing on the admin login from a single source.
 *
 * NOT a distributed limiter — multi-instance deployments need Redis or similar.
 * Keep that in mind when scaling beyond one Node process.
 *
 * Each entry stores a queue of timestamps within the window; old entries get
 * trimmed on every check, so memory is bounded by `max` per active key.
 */

const buckets = new Map<string, number[]>()

export interface RateLimitOptions {
  /** Max attempts allowed within `windowMs`. */
  max: number
  /** Sliding window length in milliseconds. */
  windowMs: number
}

export interface RateLimitResult {
  ok: boolean
  /** Remaining attempts before the window slides forward. */
  remaining: number
  /** Seconds until the oldest attempt falls out of the window. */
  retryAfterSeconds: number
}

/** Check + record one attempt for `key`. Returns whether the attempt is allowed. */
export function rateLimit(
  key: string,
  { max, windowMs }: RateLimitOptions,
): RateLimitResult {
  const now = Date.now()
  const cutoff = now - windowMs
  const queue = (buckets.get(key) ?? []).filter((t) => t > cutoff)
  if (queue.length >= max) {
    const oldest = queue[0] ?? now
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000)
    buckets.set(key, queue)
    return { ok: false, remaining: 0, retryAfterSeconds }
  }
  queue.push(now)
  buckets.set(key, queue)
  return { ok: true, remaining: max - queue.length, retryAfterSeconds: 0 }
}
