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
  - '@/lib/shared/types/paginated-list'
  - '@/lib/server/validation/blog-article-schema'
  - '@prisma/client'
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
- listArticlesForAdmin({ page?, pageSize?, search? }): Promise<PaginatedList<BlogArticleAdminDto>> — Paginated, searchable admin list. Defaults: page=1, pageSize=10, search=''.
- getArticleForAdmin(id: string): Promise<BlogArticleAdminDto> — Single article for editing
- createArticle(input: BlogArticleInput): Promise<BlogArticleAdminDto> — Create; wraps mapPrismaError + revalidateTag
- updateArticle(id: string, input: BlogArticleInput): Promise<BlogArticleAdminDto> — Update; replaces image if publicId changed, revalidates
- deleteArticle(id: string): Promise<void> — Delete; destroys Cloudinary asset, revalidates
- listPublishedArticles(locale: Locale): Promise<BlogArticleSummaryDto[]> — Public; featured first, published-date ordered, resolved text
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
- @prisma/client — Prisma namespace (for ArticleRow payload type and InputJsonValue)
- next/cache — revalidateTag

Called by:

- app/api/blog-articles/route.ts
- app/api/blog-articles/[id]/route.ts
- app/(site)/[locale]/blogs/page.tsx (public reads)
- app/(site)/[locale]/blogs/[slug]/page.tsx (public detail read)

Business Logic:

- Admin read: server-paginated + server-search. Search is `OR` across `slug` (insensitive) and JSON `title.en` (`string_contains`). Returns `{ items, total, page, pageSize }`. Ordered by `createdAt DESC` (newest first). All queries include `{ blogType: true }` so mapAdmin/mapSummary can resolve the relation.
- Public read: filters status='PUBLISHED', orders by featured desc then publishedAt desc, resolves LocalizedText to single locale string. `mapSummary` exposes `blogType: { slug, name }` (resolved for locale).
- Create: validates input via zod (blogTypeId FK), calls toData() to cast LocalizedText to Prisma.InputJsonValue and sets blogTypeId, sets publishedAt to now if status=PUBLISHED, wraps in try/catch→mapPrismaError, revalidates BLOG_ARTICLES_TAG
- Update: checks existing article exists, destroys old cover AND author-avatar Cloudinary assets if their publicId changed, re-resolves publishedAt (stays null unless transitioning to PUBLISHED)
- Delete: destroys cover + author-avatar Cloudinary assets, deletes row, revalidates tag
- Author byline: scalar `authorName`/`authorRole` and Cloudinary `authorAvatarUrl`/`authorAvatarPublicId` thread through mapAdmin/mapSummary/toData; the public page falls back to "BACA Team" when name is null
- listRelatedArticles: anchors "related" set on `blogTypeId` (from the source article); prefers same-type articles first, fills up to limit with other recent published articles. All sub-queries include `{ blogType: true }`.
- ArticleRow type: `Prisma.BlogArticleGetPayload<{ include: { blogType: true } }>` — used by all three mappers (mapAdmin, mapSummary, mapDetail).

Auth: Public reads (no guard); admin writes require auth via route handler

Side Effects:
Prisma DB writes; calls destroyUploadedImage() on replace/delete (Cloudinary API); revalidateTag() triggers ISR cache flush.

Notes:
JSONB field casting: LocalizedText cast to Prisma.InputJsonValue on write, then back to LocalizedText on read (zod guarantees shape). publishedAt auto-set only when status transitions to PUBLISHED; never changes if already PUBLISHED. Images optional (nullish). revalidateTag requires 2nd arg ('max') in Next 16.
