---
kind: 'service'
name: 'GalleryService'
file: 'lib/server/services/gallery-service/gallery-service.ts'
exports:
  - 'GALLERY_TAG'
  - 'listGalleryForAdmin'
  - 'createGalleryImage'
  - 'deleteGalleryImage'
  - 'listPublishedGallery'
imports_from:
  - '@/lib/server/cloudinary/sign-upload'
  - '@/lib/server/http/http-error'
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/localization/localized-value'
  - '@/lib/server/prisma'
  - '@/lib/shared/cloudinary-url'
  - '@/lib/shared/types/gallery-dto'
  - '@/lib/shared/types/localized-text'
  - '@/lib/server/validation/gallery-schema'
  - 'next/cache'
called_by:
  - 'app/(admin)/admin/(dashboard)/gallery/page.tsx'
  - 'app/(site)/[locale]/gallery/page.tsx'
  - 'app/api/gallery/[id]/route.ts'
  - 'app/api/gallery/route.ts'
auth: 'Public reads (no guard); admin writes require auth via route handler'
side_effects: 'Prisma DB writes; destroyUploadedImage() on delete; revalidateTag() triggers ISR cache flush.'
---

# GalleryService

Purpose:
Admin gallery (photos/videos) management with optional localized captions. Tracks media type and publication status. Provides admin list and public published-only gallery.

Exports:

- GALLERY_TAG: 'gallery' — revalidateTag identifier
- listGalleryForAdmin(): Promise<GalleryImageAdminDto[]> — All gallery items, admin view (raw LocalizedText captions)
- createGalleryImage(input: GalleryImageInput): Promise<GalleryImageAdminDto> — Create; wraps mapPrismaError + revalidateTag
- deleteGalleryImage(id: string): Promise<void> — Delete; destroys Cloudinary asset, revalidates
- listPublishedGallery(locale: Locale): Promise<GalleryImagePublicDto[]> — Public; isPublished=true, resolved captions, optimized URLs

Imports from:

- @/lib/server/cloudinary/sign-upload — destroyUploadedImage
- @/lib/server/http/http-error — notFoundError
- @/lib/server/http/prisma-error — mapPrismaError
- @/lib/server/localization/localized-value — localizedValue resolver
- @/lib/server/prisma — PrismaClient
- @/lib/shared/cloudinary-url — optimizedImageUrl
- @/lib/shared/types/gallery-dto — GalleryImageAdminDto, GalleryImagePublicDto
- @/lib/shared/types/localized-text — LocalizedText type
- @/lib/server/validation/gallery-schema — GalleryImageInput type
- next/cache — revalidateTag

Called by:

- app/api/gallery/route.ts
- app/api/gallery/[id]/route.ts
- app/(site)/[locale]/gallery/page.tsx (public reads)

Business Logic:

- Admin read: returns all items ordered by sortOrder ASC, then createdAt DESC; captions as raw LocalizedText
- Public read: filters isPublished=true, returns id, optimized imageUrl, resolved caption via localizedValue()
- Create: validates via zod, casts optional caption to Prisma.InputJsonValue (or Prisma.DbNull if null), sets mediaType (PHOTO|VIDEO), wraps in try/catch→mapPrismaError, revalidates
- Delete: queries by id, throws notFoundError if missing, destroys Cloudinary asset by imagePublicId, deletes row, revalidates

Auth: Public reads (no guard); admin writes require auth via route handler

Side Effects:
Prisma DB writes; destroyUploadedImage() on delete; revalidateTag() triggers ISR cache flush.

Notes:
Gallery items are simpler than products/categories: no name field, only optional caption + media type. Caption is optional LocalizedText (en not required). imageUrl and imagePublicId are both required on input; imagePublicId is Cloudinary's public ID for destruction.
