---
kind: 'endpoint'
name: 'UploadsApi'
file: 'lib/api-client/endpoints/uploads-api/uploads-api.ts'
exports:
  - 'uploadsApi'
imports_from:
  - '@/lib/shared/types/upload-dto'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'app/(admin)/admin/components/image-uploader/image-uploader.tsx'
auth: 'Public endpoint (anyone can request a signature); Cloudinary validates signature is authorized for the given folder server-side'
side_effects: 'HTTP request to /api/uploads/sign; no DB mutation (only generates signature).'
---

# UploadsApi

Purpose:
Typed axios wrapper for Cloudinary upload signature generation. Returns a signed request object that allows the browser uploader to upload directly to Cloudinary.

Exports:

- uploadsApi: object — { sign }

Imports from:

- @/lib/shared/types/upload-dto — UploadFolder, UploadSignature
- @/lib/api-client/axios-instance — apiClient instance

Called by:

- components/ui/image-uploader (ImageUploader component calls uploadsApi.sign before uploading to Cloudinary)

Business Logic:

- sign: POST /api/uploads/sign with { folder } body → returns UploadSignature { signature, timestamp, apiKey, cloudName, folder }
- UploadSignature is used by the client uploader to POST the image directly to https://api.cloudinary.com/v1_1/:cloud_name/image/upload with the signature, timestamp, and file

Auth: Public endpoint (anyone can request a signature); Cloudinary validates signature is authorized for the given folder server-side

Side Effects:
HTTP request to /api/uploads/sign; no DB mutation (only generates signature).

Notes:
Signature is short-lived and tied to a timestamp. Client uploader uses this to upload directly to Cloudinary, bypassing our server's request body limits. Server-side UPLOAD_FOLDERS allow-list prevents uploading to arbitrary folders.
