import 'server-only'

import { headers } from 'next/headers'

/**
 * Returns the client IP for rate-limit bucketing.
 *
 * Security:
 *   `x-forwarded-for` is **client-controlled** unless a reverse proxy strips
 *   or rewrites the incoming value. Naively taking the leftmost hop lets an
 *   attacker rotate the header per request and bypass any per-IP rate limit.
 *
 * Resolution order (most trustworthy first):
 *   1. `x-vercel-forwarded-for` — signed by Vercel's edge; can't be spoofed
 *      when running on Vercel.
 *   2. `x-forwarded-for` — parsed with `TRUSTED_PROXY_HOPS` so we pick the
 *      IP of the hop CLOSEST to our app, not the leftmost (client-set) one.
 *      Set `TRUSTED_PROXY_HOPS` to the number of trusted proxies in front
 *      of the Node server (default: 1 — assumes a single trusted proxy
 *      like Vercel / Cloudflare / nginx). Set to 0 to disable XFF parsing.
 *   3. `x-real-ip` — typically set by nginx; honored only when set.
 *   4. Literal `'unknown'` — collapses all unidentified traffic into one
 *      bucket (safer-by-default: extra throttling rather than zero).
 */
export async function getClientIp(): Promise<string> {
  const headerStore = await headers()

  const vercel = headerStore.get('x-vercel-forwarded-for')
  if (vercel) {
    const first = vercel.split(',')[0]?.trim()
    if (first) return first
  }

  const hops = Number(process.env.TRUSTED_PROXY_HOPS ?? '1')
  if (hops > 0) {
    const forwarded = headerStore.get('x-forwarded-for')
    if (forwarded) {
      const parts = forwarded
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
      if (parts.length > 0) {
        // Rightmost-trusted: from the right end, skip (hops - 1) entries to
        // land on the IP of the most-distant trusted proxy's view of the
        // client. With one trusted proxy this is the LAST element; the
        // leftmost-untrusted entries are ignored.
        const index = Math.max(0, parts.length - hops)
        return parts[index] ?? 'unknown'
      }
    }
  }

  return headerStore.get('x-real-ip') ?? 'unknown'
}
