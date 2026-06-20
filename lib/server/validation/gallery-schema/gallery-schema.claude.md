---
kind: 'schema'
name: 'GallerySchema'
file: 'lib/server/validation/gallery-schema/gallery-schema.ts'
exports:
  - 'galleryImageInputSchema'
  - 'GalleryImageInput'
imports_from:
  - 'zod'
  - '@/lib/server/validation/localized-text-schema'
called_by:
  - 'app/(admin)/admin/components/gallery-uploader-form/gallery-uploader-form.tsx'
  - 'app/api/gallery/route.ts'
  - 'lib/api-client/endpoints/gallery-api/gallery-api.ts'
  - 'lib/server/services/gallery-service/gallery-service.ts'
auth: 'n/a (validation schema)'
side_effects: 'Pure — no side effects.'
---

# GallerySchema

Purpose:
Zod schema for gallery item (photo/video) creation. Validates localized captions, image URLs, and media type.

Exports:

- galleryImageInputSchema: z.object — Full gallery item validation
- GalleryImageInput: type — Inferred type from galleryImageInputSchema

Imports from:

- zod — z object builder
- @/lib/server/validation/localized-text-schema — optionalLocalizedText

Called by:

- app/api/gallery/route.ts (POST body validation)
- lib/api-client/endpoints/gallery-api — type-only import for GalleryImageInput

Business Logic:

- caption: optionalLocalizedText.nullish() — optional per-locale caption text, may be null or undefined
- imageUrl: z.string().min(1, 'An image is required') — required, non-empty Cloudinary URL
- imagePublicId: z.string().min(1, 'An image is required') — required, non-empty Cloudinary public ID (for deletion)
- mediaType: z.enum(['PHOTO', 'VIDEO']).default('PHOTO') — type of media, defaults to PHOTO
- sortOrder: z.number().int().default(0) — display order, defaults to 0
- isPublished: z.boolean().default(true) — visibility flag, defaults to true

Auth: n/a (validation schema)

Side Effects:
Pure — no side effects.

Notes:
imageUrl and imagePublicId are both required (not nullish); together they're needed for upload tracking and deletion. caption uses optionalLocalizedText (all locales optional, no required en). No edit endpoint; gallery items are create-only or delete-only in current design.
