---
kind: 'auth'
name: 'RateLimit'
file: 'lib/server/auth/rate-limit/rate-limit.ts'
exports:
  - 'rateLimit'
  - 'RateLimitOptions'
  - 'RateLimitResult'
imports_from: []
called_by:
  - 'app/api/auth/login/route.ts'
auth: 'n/a (this IS auth infrastructure)'
side_effects: 'In-process Map mutation only.'
---

# RateLimit

Purpose:
Tiny in-process per-key sliding-window rate limiter. Used to block naive credential-stuffing on the admin login from a single IP. NOT a distributed limiter — multi-instance deploys need Redis or similar.

Exports:

- `rateLimit(key: string, { max, windowMs }): RateLimitResult` — check + record one attempt; returns `{ ok, remaining, retryAfterSeconds }`.
- `RateLimitOptions` — `{ max: number, windowMs: number }`.
- `RateLimitResult` — `{ ok: boolean, remaining: number, retryAfterSeconds: number }`.

Business Logic:

- Per-key queue of attempt timestamps in a module-level `Map`.
- On each call, trims timestamps older than `now - windowMs`.
- If remaining count meets/exceeds `max`, returns `ok: false` with `retryAfterSeconds` until the oldest attempt expires.
- Otherwise pushes `now`, persists the queue, returns `ok: true` with updated remaining count.

Called by:

- `app/api/auth/login/route.ts` — keyed on the request IP (5 attempts / 15 minutes by default).

Notes:

- Memory is bounded per active key by `max`. A bot hammering one IP can't exceed that.
- Process restart resets all counters — for a marketing site's admin login this is fine; for high-stakes APIs, switch to Redis or a CDN edge limiter.
- Caller is responsible for translating `ok === false` into the HTTP response shape (HttpError or 429).
