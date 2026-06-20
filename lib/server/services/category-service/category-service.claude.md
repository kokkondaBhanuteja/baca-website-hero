---
kind: 'service'
name: 'CategoryService'
file: 'lib/server/services/category-service/category-service.ts'
exports:
  - 'CATEGORIES_TAG'
  - 'listCategoriesForAdmin'
  - 'getCategoryForAdmin'
  - 'createCategory'
  - 'updateCategory'
  - 'deleteCategory'
  - 'getCategoriesForLocale'
imports_from:
  - '@/lib/server/cloudinary/sign-upload'
  - '@/lib/server/http/http-error'
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/localization/localized-value'
  - '@/lib/server/prisma'
  - '@/lib/shared/cloudinary-url'
  - '@/lib/shared/types/catalogue-dto'
  - '@/lib/shared/types/localized-text'
  - '@/lib/server/validation/category-schema'
  - 'next/cache'
called_by:
  - 'app/(admin)/admin/(dashboard)/categories/[id]/page.tsx'
  - 'app/(admin)/admin/(dashboard)/categories/page.tsx'
  - 'app/(admin)/admin/(dashboard)/products/[id]/page.tsx'
  - 'app/(admin)/admin/(dashboard)/products/new/page.tsx'
  - 'app/(site)/[locale]/products/page.tsx'
  - 'app/api/categories/[id]/route.ts'
  - 'app/api/categories/route.ts'
  - 'components/sections/product-preview/product-preview.tsx'
auth: 'Public reads (no guard); admin writes require auth via route handler'
side_effects: 'Prisma DB writes; destroyUploadedImage() on replace/delete; revalidateTag() triggers ISR cache flush.'
---

# CategoryService

Purpose:
CRUD for product categories with localized names/descriptions, images, and sort order. Prevents deletion if category has products. Provides admin list/detail and public categories-with-products view.

Exports:

- CATEGORIES_TAG: 'categories' — revalidateTag identifier
- listCategoriesForAdmin(): Promise<ProductCategoryAdminDto[]> — All categories with product count, admin view (raw LocalizedText)
- getCategoryForAdmin(id: string): Promise<ProductCategoryAdminDto> — Single category for editing
- createCategory(input: CategoryInput): Promise<ProductCategoryAdminDto> — Create; wraps mapPrismaError + revalidateTag
- updateCategory(id: string, input: CategoryInput): Promise<ProductCategoryAdminDto> — Update; replaces image if publicId changed, revalidates
- deleteCategory(id: string): Promise<void> — Delete; throws conflict if products exist, destroys image, revalidates
- getCategoriesForLocale(locale: Locale): Promise<ProductCategoryPublicDto[]> — Public; isPublished=true, includes published products with resolved text

Imports from:

- @/lib/server/cloudinary/sign-upload — destroyUploadedImage
- @/lib/server/http/http-error — conflictError, notFoundError
- @/lib/server/http/prisma-error — mapPrismaError
- @/lib/server/localization/localized-value — localizedValue resolver
- @/lib/server/prisma — PrismaClient
- @/lib/shared/cloudinary-url — optimizedImageUrl
- @/lib/shared/types/catalogue-dto — ProductCategoryAdminDto, ProductCategoryPublicDto
- @/lib/shared/types/localized-text — LocalizedText type
- @/lib/server/validation/category-schema — CategoryInput type
- next/cache — revalidateTag

Called by:

- app/api/categories/route.ts
- app/api/categories/[id]/route.ts
- app/(site)/[locale]/products/page.tsx (public reads)

Business Logic:

- Admin read: returns all categories with product count (via \_count include), ordered by sortOrder ASC
- Public read: filters isPublished=true, includes nested products filtered by isPublished=true, resolves all LocalizedText to locale string via localizedValue()
- Create: validates via zod, casts LocalizedText to Prisma.InputJsonValue, handles nullable description (Prisma.DbNull), wraps in try/catch→mapPrismaError, revalidates
- Update: checks exists, destroys old image if publicId differs, re-queries for \_count.products, revalidates
- Delete: checks exists, throws conflictError('Reassign or remove its products…') if \_count.products > 0, destroys image, revalidates
- getCategoriesForLocale includes nested products array; each product mapped with slug, name, summary, optimizedImageUrl

Auth: Public reads (no guard); admin writes require auth via route handler

Side Effects:
Prisma DB writes; destroyUploadedImage() on replace/delete; revalidateTag() triggers ISR cache flush.

Notes:
Deletion guarded by product count check — prevents orphaning products. JSONB nullable fields use Prisma.DbNull pattern (value ? value as InputJsonValue : Prisma.DbNull). Ordering is by scalar sortOrder, never by JSONB content.
