---
kind: 'service'
name: 'ProductService'
file: 'lib/server/services/product-service/product-service.ts'
exports:
  - 'PRODUCTS_TAG'
  - 'listProductsForAdmin'
  - 'getProductForAdmin'
  - 'createProduct'
  - 'updateProduct'
  - 'deleteProduct'
  - 'listPublishedProducts'
imports_from:
  - '@/lib/server/cloudinary/sign-upload'
  - '@/lib/server/http/http-error'
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/localization/localized-value'
  - '@/lib/server/prisma'
  - '@/lib/shared/types/catalogue-dto'
  - '@/lib/shared/types/localized-text'
  - '@/lib/shared/types/paginated-list'
  - '@/lib/server/validation/product-schema'
  - 'next/cache'
called_by:
  - 'app/(admin)/admin/(dashboard)/products/[id]/page.tsx'
  - 'app/(admin)/admin/(dashboard)/products/page.tsx'
  - 'app/api/products/[id]/route.ts'
  - 'app/api/products/route.ts'
  - 'components/layout/site-header/site-header.tsx'
auth: 'Public reads filtered via category service; admin writes require auth via route handler'
side_effects: 'Prisma DB writes; destroyUploadedImage() on replace/delete; revalidateTag() triggers ISR cache flush.'
---

# ProductService

Purpose:
CRUD for products with localized names/summaries/descriptions, images, and category relationships. Provides admin list/detail and public product catalogue filtered by category.

Exports:

- PRODUCTS_TAG: 'products' — revalidateTag identifier
- listProductsForAdmin({ page?, pageSize?, search? }): Promise<PaginatedList<ProductAdminDto>> — Paginated, searchable admin list. Defaults: page=1, pageSize=10, search=''.
- getProductForAdmin(id: string): Promise<ProductAdminDto> — Single product for editing
- createProduct(input: ProductInput): Promise<ProductAdminDto> — Create; wraps mapPrismaError + revalidateTag
- updateProduct(id: string, input: ProductInput): Promise<ProductAdminDto> — Update; replaces image if publicId changed, revalidates
- deleteProduct(id: string): Promise<void> — Delete; destroys Cloudinary asset, revalidates
- listPublishedProducts(locale: Locale, take?: number): Promise<{ slug: string; name: string }[]> — Top published products (nav dropdown); resolved names

Imports from:

- @/lib/server/cloudinary/sign-upload — destroyUploadedImage
- @/lib/server/http/http-error — notFoundError
- @/lib/server/http/prisma-error — mapPrismaError
- @/lib/server/localization/localized-value — localizedValue resolver
- @/lib/server/prisma — PrismaClient
- @/lib/shared/types/catalogue-dto — ProductAdminDto
- @/lib/shared/types/localized-text — LocalizedText type
- @/lib/server/validation/product-schema — ProductInput type
- next/cache — revalidateTag

Called by:

- app/api/products/route.ts
- app/api/products/[id]/route.ts
- app/(site)/[locale]/products/page.tsx (via category service)
- app/(site)/[locale]/layout.tsx (nav dropdown via listPublishedProducts)

Business Logic:

- Admin read: server-paginated (`skip`/`take` from `page`/`pageSize`) + server-search. Search is an `OR` across `slug` (case-insensitive `contains`), JSON `name.en` (`string_contains`, case-sensitive), and joined `category.name.en` (`string_contains`). Returns `{ items, total, page, pageSize }`. Ordered by `categoryId ASC, sortOrder ASC`.
- Public read (via category service): filters isPublished=true AND category.isPublished=true, ordered by sortOrder ASC
- Create: validates via zod, casts LocalizedText fields to Prisma.InputJsonValue, handles nullable summary/description (Prisma.DbNull), wraps in try/catch→mapPrismaError, revalidates
- Update: checks exists, destroys old image if publicId differs, revalidates
- Delete: checks exists, destroys image, revalidates
- listPublishedProducts: queries top N (default 3) published products with published category, returns { slug, resolvedName } (used by nav dropdown to list featured products)

Auth: Public reads filtered via category service; admin writes require auth via route handler

Side Effects:
Prisma DB writes; destroyUploadedImage() on replace/delete; revalidateTag() triggers ISR cache flush.

Notes:
Products belong to a category (categoryId foreign key). admin reads include category object (no nested query). Public reads happen through category service (categories-api → getCategoriesForLocale), not directly. Nullable fields (summary, description) use Prisma.DbNull pattern.
