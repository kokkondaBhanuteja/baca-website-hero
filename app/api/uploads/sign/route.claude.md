---
kind: 'api-route'
name: 'UploadsSignApi'
file: 'app/api/uploads/sign/route.ts'
exports:
  - 'POST'
imports_from:
  - 'zod'
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/cloudinary/sign-upload'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
route: '/api/uploads/sign'
methods:
  - 'POST'
---

# UploadsSignApi

Route: `/api/uploads/sign`  
Methods: POST  
Envelope: via handleRoute

Purpose:
Sign Cloudinary upload request. Admin calls this before direct upload to Cloudinary. Returns signature + other params needed for client-side unsigned upload.

## Per-method

### POST

- **Auth:** requireAdmin
- **Validation:** signRequestSchema — folder (string, required, min length 1)
- **Service:** createUploadSignature(folder) — calls Cloudinary API, returns { signature, timestamp, public_id, ... }
- **Response:** ok(signature) — Cloudinary signature object
- **Errors:** 400 (validation), 401

Notes:
Admin client calls this with a folder name (e.g., 'baca-gallery'), receives signature, then POSTs image directly to Cloudinary with signature. Cloudinary returns imageUrl which admin then stores via POST /api/gallery.
