---
kind: 'component'
name: 'ImageUploader'
file: 'app/(admin)/admin/components/image-uploader/image-uploader.tsx'
exports:
  - 'ImageUploader'
imports_from:
  - 'lucide-react'
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/uploads-api'
  - '@/lib/shared/types/upload-dto'
---

# ImageUploader

Purpose:
Cloudinary signed upload component: get signature from backend, POST file directly to Cloudinary, capture URL + public_id.

Used In:

- All admin forms that need images: product-form, category-form, blog-article-form, gallery-uploader-form

Props:

- label: string — field label
- folder: UploadFolder — Cloudinary folder path (e.g., 'baca/products', 'baca/gallery')
- value: UploadedImage | null — current image (null if none selected)
- onChange: (image: UploadedImage | null) => void — callback when image changes

Business Logic:

- If value exists: shows preview img (h-40 w-40) + remove button (X icon)
- If no value: shows upload dropzone (h-40 w-40 dashed border, flex flex-col center), accepts image/\* files
- onChange(file): calls uploadsApi.sign(folder) to get Cloudinary signature + apiKey, timestamp, signature, folder, cloudName
- Builds FormData, appends file + signature fields, POSTs to Cloudinary endpoint
- On success: parses response, calls onChange({imageUrl: secure_url, imagePublicId: public_id})
- On error: displays error message, event.target.value = '' to reset input
- Uploading state: shows 'Uploading…' label, disabled input

Dependencies:

- React hooks: useState
- lucide-react: ImagePlus, X
- @/lib/api-client/endpoints/uploads-api
- @/lib/shared/types/upload-dto
- fetch API (direct Cloudinary upload)

i18n:
None — English only

Accessibility:
Label wraps the upload zone (accessible click area). Remove button has aria-label.

Notes:
Uses signed uploads (secure, server validates before generating signature). The signature is short-lived. Direct Cloudinary upload keeps the upload off the main backend and is more performant. Public_id is used for deletions later.
