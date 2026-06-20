---
kind: 'service'
name: 'AdminUserService'
file: 'lib/server/services/admin-user-service/admin-user-service.ts'
exports:
  - 'authenticateAdmin'
imports_from:
  - '@/lib/server/auth/password'
  - '@/lib/server/http/http-error'
  - '@/lib/server/prisma'
  - '@/lib/shared/types/admin-user-dto'
called_by:
  - 'app/api/auth/login/route.ts'
auth: 'n/a (this IS the auth layer)'
side_effects: 'DB read only; verifyPassword uses native argon2 hash verification.'
---

# AdminUserService

Purpose:
Authenticates admin users by verifying email and password credentials. Returns a generic 401 for both unknown-email and wrong-password to prevent account enumeration. Called by auth route handlers on login.

Exports:

- authenticateAdmin(email: string, password: string): Promise<AdminUserDto> — Verifies credentials against the AdminUser table; throws unauthorized() on failure

Imports from:

- @/lib/server/auth/password — verifyPassword function
- @/lib/server/http/http-error — unauthorized error factory
- @/lib/server/prisma — PrismaClient singleton
- @/lib/shared/types/admin-user-dto — AdminUserDto type

Called by:

- app/api/auth/login/route.ts

Business Logic:

- Queries prisma.adminUser by lowercase email
- Throws unauthorized() if user not found (no enum attack)
- Calls verifyPassword() to check argon2id hash against plaintext input
- Throws unauthorized() if hash doesn't match
- Returns AdminUserDto with id, email, name, role stripped from the DB row

Auth: n/a (this IS the auth layer)

Side Effects:
DB read only; verifyPassword uses native argon2 hash verification.

Notes:
Email is lowercased on query to handle case-insensitive lookups. Throws the same error for both missing user and wrong password (timing-attack resistance).
