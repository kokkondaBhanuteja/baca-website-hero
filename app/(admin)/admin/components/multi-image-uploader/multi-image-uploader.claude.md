---
kind: 'component'
name: 'MultiImageUploader'
file: 'app/(admin)/admin/components/multi-image-uploader/multi-image-uploader.tsx'
exports: ['MultiImageUploader']
imports_from:
  - 'react'
  - 'lucide-react'
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/uploads-api'
  - '@/lib/shared/types/catalogue-dto'
  - '@/lib/shared/types/upload-dto'
---

# MultiImageUploader

Purpose:
Manages an ordered list of product images (`ProductImage[] = { url, publicId }[]`).
The **first image is the cover** (used on cards/grid; the server derives
`imageUrl`/`imagePublicId` from `images[0]`); all images render in the
detail-page carousel.

Used In:

- `product-form` (the product's images field)

Business Logic:

- Signs + uploads each file via `uploadsApi.sign(folder)` → POST to Cloudinary
  `/image/upload` (same flow as the single `ImageUploader`; **does not** send a
  signed `resource_type` — see sign-upload). Multi-select uploads sequentially.
- Capacity capped at `max` (default 12); extra files are ignored.
- Thumbnails: index 0 shows a "Cover" badge; others show "Set as cover"
  (moves to front) on hover. Each has a remove (×).
- Unmount guard prevents setState after the async upload.

Props: `label`, `hint?`, `folder: UploadFolder`, `value: ProductImage[]`,
`onChange(images)`, `max?` (default 12).

Dependencies: uploadsApi, ProductImage type, lucide icons.
