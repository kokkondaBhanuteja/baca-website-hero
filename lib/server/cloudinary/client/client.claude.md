---
kind: 'cloudinary'
name: 'CloudinaryClient'
file: 'lib/server/cloudinary/client/client.ts'
exports:
  - 'cloudinary'
imports_from:
  - 'cloudinary'
  - '@/lib/server/env'
called_by:
  - 'lib/server/cloudinary/sign-upload/sign-upload.ts'
auth: 'n/a (API client configuration)'
side_effects: 'Configures global cloudinary state on import (one-time setup).'
---

# CloudinaryClient

Purpose:
Singleton Cloudinary v2 client configured with server-side secrets. Used only by sign-upload.ts and seed.ts (image destruction/upload signing).

Exports:

- cloudinary: v2 (re-exported) — Configured Cloudinary client instance

Imports from:

- cloudinary — v2 as cloudinary
- @/lib/server/env — serverEnvironment (contains CLOUDINARY\_\* secrets)

Called by:

- lib/server/cloudinary/sign-upload — calls cloudinary.uploader.destroy() and cloudinary.utils.api_sign_request()
- prisma/seed.ts — may use cloudinary for cleanup

Business Logic:

- Configures cloudinary.config() with cloud_name, api_key, api_secret from serverEnvironment
- Sets secure: true for HTTPS-only API calls
- Re-exports the configured cloudinary instance

Auth: n/a (API client configuration)

Side Effects:
Configures global cloudinary state on import (one-time setup).

Notes:
serverEnvironment.CLOUDINARY\_\* are optional (checked by isCloudinaryConfigured flag elsewhere). Credentials never leave the server. The public cloud_name is also in NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (for client-side uploads).
