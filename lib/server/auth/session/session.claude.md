---
kind: 'auth'
name: 'SessionAuth'
file: 'lib/server/auth/session/session.ts'
exports:
  - 'SESSION_COOKIE_NAME'
  - 'SESSION_MAX_AGE_SECONDS'
  - 'getCurrentAdmin'
imports_from:
  - 'next/headers'
  - '@/lib/server/prisma'
  - '@/lib/shared/types/admin-user-dto'
  - '@/lib/server/auth/jwt'
called_by:
  - 'app/(admin)/admin/(dashboard)/layout.tsx'
  - 'app/api/auth/login/route.ts'
  - 'app/api/auth/logout/route.ts'
  - 'lib/server/auth/require-admin/require-admin.ts'
auth: 'n/a (this IS the session layer)'
side_effects: 'Reads cookies; queries Prisma for admin user on each call.'
---

# SessionAuth

Purpose:
Session cookie management. Reads the httpOnly 'baca_admin_session' cookie, verifies the JWT inside, and returns the admin user from DB.

Exports:

- SESSION_COOKIE_NAME: 'baca_admin_session' — cookie key
- SESSION_MAX_AGE_SECONDS: 28800 (8 hours) — cookie lifetime
- getCurrentAdmin(): Promise<AdminUserDto | null> — Reads session and returns admin or null

Imports from:

- next/headers — cookies() to read request cookies
- @/lib/server/prisma — PrismaClient to fetch admin by id
- @/lib/shared/types/admin-user-dto — AdminUserDto type
- @/lib/server/auth/jwt — verifySessionToken function

Called by:

- lib/server/auth/require-admin — calls getCurrentAdmin to check auth
- app/(admin)/admin/layout.tsx (Server Component, checks getCurrentAdmin for redirect)
- app/api/auth/me/route.ts (GET /auth/me endpoint)

Business Logic:

- Calls next/headers cookies() to get the current request's cookies
- Reads the 'baca_admin_session' cookie value (JWT string)
- Calls verifySessionToken(token) to verify the JWT signature and issuer
- If token is null/invalid, returns null
- If token is valid, extracts payload.adminId (the 'sub' claim) and queries prisma.adminUser by that id
- If user doesn't exist in DB, returns null
- Otherwise returns AdminUserDto { id, email, name, role } stripped from the DB row

Auth: n/a (this IS the session layer)

Side Effects:
Reads cookies; queries Prisma for admin user on each call.

Notes:
Calls both verifySessionToken (checks JWT signature) and DB lookup (ensures user still exists). Returning null from getCurrentAdmin means requireAdmin() will throw 401. Cookie is httpOnly (JS can't access it) so XSS can't steal it. SESSION_MAX_AGE_SECONDS is metadata; the actual expiry is in the JWT (8h).
