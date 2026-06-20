---
kind: 'auth'
name: 'JwtAuth'
file: 'lib/server/auth/jwt/jwt.ts'
exports:
  - 'SessionPayload'
  - 'signSessionToken'
  - 'verifySessionToken'
imports_from:
  - 'jose'
  - '@/lib/server/env'
called_by:
  - 'app/api/auth/login/route.ts'
  - 'lib/server/auth/session/session.ts'
auth: 'n/a (this IS the auth layer)'
side_effects: 'Pure cryptographic operations; reads serverEnvironment once on import.'
---

# JwtAuth

Purpose:
JWT token signing/verification for admin sessions. Uses HS256 (HMAC-SHA256) with a server-only secret. Tokens are 8 hours TTL, issued by 'baca-admin', with the subject (sub) as adminId and role in the payload.

Exports:

- SessionPayload: interface — { adminId: string, role: string }
- signSessionToken(payload: SessionPayload): Promise<string> — Signs and returns JWT token string
- verifySessionToken(token: string): Promise<SessionPayload | null> — Verifies and returns payload or null

Imports from:

- jose — SignJWT, jwtVerify (JWT handling library)
- @/lib/server/env — serverEnvironment.JWT_SECRET

Called by:

- app/api/auth/login/route.ts (calls signSessionToken, stores in httpOnly cookie)
- lib/server/auth/session.ts (calls verifySessionToken to read from cookie)

Business Logic:

- signSessionToken: creates SignJWT with { role: payload.role }, sets algorithm to HS256, sets subject to adminId, sets issuer to 'baca-admin', sets issuedAt to now, sets expirationTime to '8h', signs with serverEnvironment.JWT_SECRET
- verifySessionToken: calls jose.jwtVerify with token, secret, and issuer constraint; returns null if verification fails or payload.sub/role are not strings; on success returns { adminId: payload.sub, role: payload.role }
- Secret is UTF-8 TextEncoder.encode(JWT_SECRET) and must be ≥32 chars (enforced by env schema)

Auth: n/a (this IS the auth layer)

Side Effects:
Pure cryptographic operations; reads serverEnvironment once on import.

Notes:
JWT is stored in httpOnly cookie (set by login route), verified on each request by session.ts. 8-hour TTL means tokens expire automatically. issuer constraint prevents tokens from other services being accepted. role is stored in JWT payload but not checked here; checked at route level via requireAdmin.
