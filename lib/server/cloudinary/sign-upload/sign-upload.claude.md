---
kind: 'cloudinary'
name: 'SignUpload'
file: 'lib/server/cloudinary/sign-upload/sign-upload.ts'
exports:
  - 'UPLOAD_FOLDERS'
  - 'createUploadSignature'
  - 'destroyUploadedImage'
imports_from:
  - '@/lib/server/env'
  - '@/lib/server/http/http-error'
  - '@/lib/shared/types/upload-dto'
  - '@/lib/server/cloudinary/client'
called_by:
  - 'app/api/uploads/sign/route.ts'
  - 'lib/server/services/blog-article-service/blog-article-service.ts'
  - 'lib/server/services/category-service/category-service.ts'
  - 'lib/server/services/gallery-service/gallery-service.ts'
  - 'lib/server/services/product-service/product-service.ts'
auth: 'Public (anyone can request a signature); upload to Cloudinary is signed so only valid signatures work'
side_effects: 'destroyUploadedImage calls Cloudinary API (network call, fire-and-forget error handling).'
---

# SignUpload

Purpose:
Server-side generation of short-lived Cloudinary upload signatures. The admin uploader gets a signature, then uploads directly to Cloudinary (bypassing our server's request body size limits).

Exports:

- UPLOAD_FOLDERS: readonly UploadFolder[] — Allow-listed upload paths: 'baca/products', 'baca/categories', 'baca/blog', 'baca/gallery'
- createUploadSignature(folder: string): UploadSignature — Creates a signed upload request { signature, timestamp, apiKey, cloudName, folder }
- destroyUploadedImage(publicId: string | null | undefined): Promise<void> — Best-effort delete of uploaded asset

Imports from:

- @/lib/server/env — isCloudinaryConfigured, serverEnvironment.CLOUDINARY\_\*
- @/lib/server/http/http-error — badRequest
- @/lib/shared/types/upload-dto — UploadFolder, UploadSignature types
- @/lib/server/cloudinary/client — cloudinary instance

Called by:

- app/api/uploads/sign/route.ts (POST /api/uploads/sign, returns signature to client uploader)
- lib/server/services/\* (on image replace/delete: calls destroyUploadedImage(publicId))

Business Logic:

- createUploadSignature: checks isCloudinaryConfigured (throws badRequest if not configured), checks folder is in UPLOAD_FOLDERS (throws badRequest if not), calculates unix timestamp, calls cloudinary.utils.api_sign_request({ timestamp, folder }, secret), returns { signature, timestamp, apiKey, cloudName, folder } (no secret included)
- destroyUploadedImage: checks publicId is truthy and Cloudinary is configured; if so, calls cloudinary.uploader.destroy(publicId) and swallows errors with console.error logging (best-effort)

Auth: Public (anyone can request a signature); upload to Cloudinary is signed so only valid signatures work

Side Effects:
destroyUploadedImage calls Cloudinary API (network call, fire-and-forget error handling).

Notes:
Signature is short-lived (tied to timestamp); Cloudinary validates timestamp hasn't drifted too far. UPLOAD_FOLDERS is a server-side allow-list preventing admin from uploading to arbitrary folders. destroyUploadedImage swallows errors (if delete fails, we log but don't throw — partial cleanup is OK). Images are stored with their publicId (e.g. 'baca/products/abc123') for later destruction.
