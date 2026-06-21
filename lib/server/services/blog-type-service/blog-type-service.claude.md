---
kind: 'service'
name: 'blog-type-service'
file: 'lib/server/services/blog-type-service/blog-type-service.ts'
exports:
  - 'BLOG_TYPES_TAG'
  - 'listAllBlogTypesForAdmin'
  - 'listBlogTypesForAdmin'
  - 'getBlogTypeForAdmin'
  - 'createBlogType'
  - 'updateBlogType'
  - 'deleteBlogType'
  - 'listPublishedBlogTypes'
imports_from:
  - 'server-only'
  - '@prisma/client'
  - 'next/cache'
  - '@/lib/server/http/http-error'
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/localization/localized-value'
  - '@/lib/server/prisma'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/shared/types/blog-type-dto'
  - '@/lib/server/validation/blog-type-schema/blog-type-schema'
called_by:
  - 'app/api/blog-types/route.ts'
  - 'app/api/blog-types/[id]/route.ts'
  - 'app/(site)/[locale]/blogs/page.tsx'
  - 'app/(admin)/admin/(dashboard)/blog-types/*'
  - 'blog-article-form admin pages (listAllBlogTypesForAdmin)'
auth: 'admin reads/writes via API requireAdmin; listPublishedBlogTypes is public'
---

# blog-type-service

Admin-managed blog types (mirrors category-service, minus images). CRUD +
paginated/non-paginated admin reads + `listPublishedBlogTypes(locale)` (tagged
`unstable_cache`). `deleteBlogType` refuses when articles reference the type
(`onDelete: Restrict` + explicit count guard → conflictError). Mutations
revalidate `BLOG_TYPES_TAG` and `BLOG_ARTICLES_TAG` (a renamed type changes
article cards/pills).
