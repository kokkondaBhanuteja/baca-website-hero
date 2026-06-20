---
kind: 'auth'
name: 'PasswordAuth'
file: 'lib/server/auth/password/password.ts'
exports:
  - 'hashPassword'
  - 'verifyPassword'
imports_from:
  - '@node-rs/argon2'
called_by:
  - 'lib/server/services/admin-user-service/admin-user-service.ts'
auth: 'n/a (this IS the auth layer)'
side_effects: 'Pure cryptographic operations; CPU-bound (async).'
---

# PasswordAuth

Purpose:
Argon2id password hashing and verification. Uses @node-rs/argon2 with OWASP-recommended defaults. Hashing is async and salted; verification is constant-time.

Exports:

- hashPassword(plainText: string): Promise<string> — Hashes plaintext password, returns argon2id hash string
- verifyPassword(storedHash: string, plainText: string): Promise<boolean> — Verifies plaintext against stored hash, returns true/false

Imports from:

- @node-rs/argon2 — hash, verify functions

Called by:

- lib/server/services/admin-user-service — verifyPassword called on login
- prisma/seed.ts — hashPassword called when seeding admin user

Business Logic:

- hashPassword: delegates to @node-rs/argon2 hash() with OWASP defaults (memory, time, parallelism), returns salt+hash string
- verifyPassword: delegates to @node-rs/argon2 verify(), returns boolean (timing-safe comparison)

Auth: n/a (this IS the auth layer)

Side Effects:
Pure cryptographic operations; CPU-bound (async).

Notes:
Argon2id is memory-hard and resistant to GPU attacks. Both functions are async (return Promise). OWASP defaults handle the configuration, no need to tune parameters. Do not use plain hashing (bcrypt/scrypt); argon2 is superior for password storage.
