---
kind: 'env'
name: 'ServerEnvironment'
file: 'lib/server/env/env.ts'
exports:
  - 'serverEnvironment'
  - 'isCloudinaryConfigured'
imports_from:
  - 'zod'
called_by:
  - 'lib/server/auth/jwt/jwt.ts'
  - 'lib/server/cloudinary/client/client.ts'
  - 'lib/server/cloudinary/sign-upload/sign-upload.ts'
auth: 'n/a (environment config)'
side_effects: 'Reads process.env once on import; throws if required vars are missing (fail-fast at boot).'
---

# ServerEnvironment

Purpose:
Centralized environment variable parsing and validation. Parsed once on import; fails fast at boot if a required secret is missing.

Exports:

- serverEnvironment: z.infer<typeof environmentSchema> — Parsed env object { DATABASE*URL, JWT_SECRET, SEED_ADMIN_EMAIL?, SEED_ADMIN_PASSWORD?, CLOUDINARY*\* }
- isCloudinaryConfigured: boolean — True if all three CLOUDINARY\_\* vars are non-empty

Imports from:

- zod — z object builder

Called by:

- lib/server/auth/jwt — reads serverEnvironment.JWT_SECRET
- lib/server/cloudinary/client — reads serverEnvironment.CLOUDINARY\_\*
- lib/server/cloudinary/sign-upload — reads serverEnvironment.CLOUDINARY\_\* and isCloudinaryConfigured
- lib/server/prisma — indirectly (Prisma connects to DATABASE_URL)
- prisma/seed.ts — reads SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD

Business Logic:

- Defines environmentSchema as z.object with required DATABASE*URL, JWT_SECRET (min 32 chars), optional SEED_ADMIN*_, optional CLOUDINARY\__ (default to '')
- Calls environmentSchema.parse(process.env) on import → throws ZodError if missing required vars or validation fails
- Computes isCloudinaryConfigured as a boolean (all three CLOUDINARY\_\* are truthy)
- Exports both serverEnvironment and isCloudinaryConfigured

Auth: n/a (environment config)

Side Effects:
Reads process.env once on import; throws if required vars are missing (fail-fast at boot).

Notes:
DATABASE_URL and JWT_SECRET are required; Cloudinary is optional (allows running without image upload). JWT_SECRET must be ≥32 chars (enforce strong keys). Seed vars are optional (only used by prisma/seed.ts). No client-side secrets here (server-only file).
