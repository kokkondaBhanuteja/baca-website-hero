---
kind: 'schema'
name: 'AuthSchema'
file: 'lib/server/validation/auth-schema/auth-schema.ts'
exports:
  - 'loginSchema'
  - 'LoginInput'
imports_from:
  - 'zod'
called_by:
  - 'app/api/auth/login/route.ts'
auth: 'n/a (this IS validation schema for auth)'
side_effects: 'Pure — no side effects.'
---

# AuthSchema

Purpose:
Zod schema for admin login credentials. Validates the email/password POST body.

Exports:

- loginSchema: z.object — Validates email (required, non-empty string) and password (required, non-empty string)
- LoginInput: type — Inferred type from loginSchema

Imports from:

- zod — z object builder

Called by:

- app/api/auth/login/route.ts (request body validation)

Business Logic:

- email: z.string().min(1, 'Email is required') — non-empty, no format check (validation happens at authenticate stage)
- password: z.string().min(1, 'Password is required') — non-empty, no complexity requirements

Auth: n/a (this IS validation schema for auth)

Side Effects:
Pure — no side effects.

Notes:
Minimal validation by design; credentials are validated by authenticateAdmin service (which checks DB + hashing). Error messages are user-facing.
