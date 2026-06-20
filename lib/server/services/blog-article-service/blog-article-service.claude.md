---
kind: 'service'
name: 'BlogArticleService'
file: 'lib/server/services/blog-article-service/blog-article-service.ts'
exports:
  - 'BLOG_ARTICLES_TAG'
  - 'listArticlesForAdmin'
  - 'getArticleForAdmin'
  - 'createArticle'
  - 'updateArticle'
  - 'deleteArticle'
  - 'listPublishedArticles'
  - 'listPublishedSlugs'
  - 'getPublishedArticleBySlug'
  - 'listRelatedArticles'
imports_from:
  - '@/lib/server/cloudinary/sign-upload'
  - '@/lib/server/http/http-error'
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/localization/localized-value'
  - '@/lib/server/prisma'
  - '@/lib/shared/cloudinary-url'
  - '@/lib/shared/types/blog-dto'
  - '@/lib/shared/types/localized-text'
  - '@/lib/server/validation/blog-article-schema'
  - 'next/cache'
called_by:
  - 'app/(admin)/admin/(dashboard)/blog-articles/[id]/page.tsx'
  - 'app/(admin)/admin/(dashboard)/blog-articles/page.tsx'
  - 'app/(site)/[locale]/blogs/[articleSlug]/page.tsx'
  - 'app/(site)/[locale]/blogs/page.tsx'
  - 'app/api/blog-articles/[id]/route.ts'
  - 'app/api/blog-articles/route.ts'
  - 'components/layout/site-header/site-header.tsx'
  - 'components/sections/featured-insights/featured-insights.tsx'
auth: 'Public reads (no guard); admin writes require auth via route handler'
side_effects: 'Prisma DB writes; calls destroyUploadedImage() on replace/delete (Cloudinary API); revalidateTag() triggers ISR cache flush.'
---

# BlogArticleService

Purpose:
CRUD operations for blog articles with admin (raw localized text) and public (resolved per-locale) read paths. Handles article images via Cloudinary, status/publish dates, and cache invalidation.

Exports:

- BLOG_ARTICLES_TAG: 'blog-articles' — revalidateTag identifier
- listArticlesForAdmin(): Promise<BlogArticleAdminDto[]> — All articles, newest first, admin view (raw LocalizedText)
- getArticleForAdmin(id: string): Promise<BlogArticleAdminDto> — Single article for editing
- createArticle(input: BlogArticleInput): Promise<BlogArticleAdminDto> — Create; wraps mapPrismaError + revalidateTag
- updateArticle(id: string, input: BlogArticleInput): Promise<BlogArticleAdminDto> — Update; replaces image if publicId changed, revalidates
- deleteArticle(id: string): Promise<void> — Delete; destroys Cloudinary asset, revalidates
- listPublishedArticles(locale: Locale): Promise<BlogArticleSummaryDto[]> — Public; featured first, published-date ordered, resolved text
- listPublishedSlugs(): Promise<string[]> — All published article slugs (for static generation)
- getPublishedArticleBySlug(slug: string, locale: Locale): Promise<BlogArticleDetailDto | null> — Public detail; full body resolved
- listRelatedArticles(excludeSlug: string, locale: Locale, limit?: number): Promise<BlogArticleSummaryDto[]> — Up to N related articles, newest first

Imports from:

- @/lib/server/cloudinary/sign-upload — destroyUploadedImage
- @/lib/server/http/http-error — notFoundError
- @/lib/server/http/prisma-error — mapPrismaError
- @/lib/server/localization/localized-value — localizedValue resolver
- @/lib/server/prisma — PrismaClient
- @/lib/shared/cloudinary-url — optimizedImageUrl
- @/lib/shared/types/blog-dto — BlogArticleAdminDto, BlogArticleSummaryDto, BlogArticleDetailDto
- @/lib/shared/types/localized-text — LocalizedText type
- @/lib/server/validation/blog-article-schema — BlogArticleInput type
- next/cache — revalidateTag

Called by:

- app/api/blog-articles/route.ts
- app/api/blog-articles/[id]/route.ts
- app/(site)/[locale]/blogs/page.tsx (public reads)
- app/(site)/[locale]/blogs/[slug]/page.tsx (public detail read)

Business Logic:

- Admin read: returns all fields including raw LocalizedText objects and image URLs (no optimization)
- Public read: filters status='PUBLISHED', orders by featured desc then publishedAt desc, resolves LocalizedText to single locale string
- Create: validates input via zod, calls toData() to cast LocalizedText to Prisma.InputJsonValue, sets publishedAt to now if status=PUBLISHED, wraps in try/catch→mapPrismaError, revalidates BLOG_ARTICLES_TAG
- Update: checks existing article exists, destroys old Cloudinary asset if publicId changed, re-resolves publishedAt (stays null unless transitioning to PUBLISHED)
- Delete: destroys Cloudinary asset, deletes row, revalidates tag
- listRelatedArticles: excludes current article, limits to N (default 3), orders by publishedAt DESC

Auth: Public reads (no guard); admin writes require auth via route handler

Side Effects:
Prisma DB writes; calls destroyUploadedImage() on replace/delete (Cloudinary API); revalidateTag() triggers ISR cache flush.

Notes:
JSONB field casting: LocalizedText cast to Prisma.InputJsonValue on write, then back to LocalizedText on read (zod guarantees shape). publishedAt auto-set only when status transitions to PUBLISHED; never changes if already PUBLISHED. Images optional (nullish). revalidateTag requires 2nd arg ('max') in Next 16.
