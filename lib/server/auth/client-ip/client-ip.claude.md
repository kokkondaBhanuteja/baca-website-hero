---
kind: 'auth'
name: 'ClientIp'
file: 'lib/server/auth/client-ip/client-ip.ts'
exports:
  - 'getClientIp'
imports_from:
  - 'next/headers'
called_by:
  - 'app/api/auth/login/route.ts'
  - 'app/api/enquiry/route.ts'
auth: 'n/a (used to derive the rate-limit key)'
side_effects: 'Reads request headers.'
---

# ClientIp

Purpose:
Returns the client IP that should be used as a rate-limit bucket key. Built to resist `x-forwarded-for` spoofing — naïvely trusting the leftmost XFF value lets an attacker rotate the header per request and bypass any per-IP limit.

Exports:

- `getClientIp(): Promise<string>` — resolves to the most trustworthy client IP available, or the literal `'unknown'`.

Resolution order (most trustworthy first):

1. `x-vercel-forwarded-for` — signed by Vercel's edge; can't be spoofed when running on Vercel.
2. `x-forwarded-for` parsed with `TRUSTED_PROXY_HOPS` — picks the hop CLOSEST to our app (rightmost), not the leftmost (client-set) one.
3. `x-real-ip` — typically nginx-set.
4. Literal `'unknown'` — collapses all unidentified traffic into one bucket (safer than per-request bypass).

Configuration:

- `TRUSTED_PROXY_HOPS` env (default `'1'`): how many proxies are in front of Node. Set to `0` to disable XFF parsing entirely; set higher when chaining proxies.

Called by:

- `app/api/auth/login/route.ts` — login rate-limit key.
- `app/api/enquiry/route.ts` — public enquiry-form rate-limit key.

Notes:

- For high-stakes endpoints, prefer the Vercel-signed header (or your platform's equivalent) over plain XFF — it can't be forged at the edge.
- If/when the project moves to a multi-proxy setup, bump `TRUSTED_PROXY_HOPS` accordingly. Document the deployed topology before changing the default.
