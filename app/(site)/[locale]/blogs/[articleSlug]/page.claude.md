---
kind: 'page'
name: 'BlogArticlePage'
file: 'app/(site)/[locale]/blogs/[articleSlug]/page.tsx'
exports:
  - 'generateMetadata'
  - 'dynamic'
  - 'BlogArticlePage'
  - 'default'
imports_from:
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/shared/types/blog-dto'
  - '@/components/ui/media-reveal'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
route: '/[locale]/blogs/[articleSlug]'
auth: 'Public'
---

# BlogArticlePage

Route: `/[locale]/blogs/[articleSlug]`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Public

Purpose:
Single article detail page. Displays full article body, cover image, category, read time, and a related articles section. notFound() if article slug is unknown.

Data:

- getPublishedArticleBySlug(articleSlug, locale) — full article with title, excerpt, body, coverImageUrl, category, readMinutes
- listRelatedArticles(articleSlug, locale) — 3 related article summaries

Business Logic:

- export const dynamic = 'force-dynamic'
- generateMetadata() fetches article and returns title/description; fallback if not found
- Calls getPublishedArticleBySlug(); notFound() if falsy
- Splits article.body by double newlines into paragraphs
- Renders cover image if article.coverImageUrl
- Back link to Route.Blogs
- Related articles section if related.length > 0

Renders:

- SiteHeader (forceSolid)
- Back link to blogs list
- Category badge, read time
- Article title, excerpt
- Cover image (MediaReveal)
- Body paragraphs
- Related articles grid (3 columns on md+)
- SiteFooter

Notes:
Uses notFound() for unknown slugs. Body is plain text split by double newlines. Related articles fetched separately to avoid N+1. Articles fetched in generateMetadata and page render (two calls).
