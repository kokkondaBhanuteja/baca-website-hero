---
kind: 'page'
name: 'BlogsPage'
file: 'app/(site)/[locale]/blogs/page.tsx'
exports:
  - 'generateMetadata'
  - 'dynamic'
  - 'BlogsPage'
  - 'default'
imports_from:
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/shared/types/blog-dto'
  - '@/components/ui/media-reveal'
  - '@/components/shared/page-intro'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
route: '/[locale]/blogs'
auth: 'Public'
---

# BlogsPage

Route: `/[locale]/blogs`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Public

Purpose:
List of published blog articles. Displays articles in a 3-column grid with cover images, category badges, read time, title, and excerpt. force-dynamic ensures fresh content.

Data:

- listPublishedArticles(locale) — returns published BlogArticleSummaryDto items with title, slug, excerpt, featured, category, readMinutes, coverImageUrl

Business Logic:

- export const dynamic = 'force-dynamic'
- setRequestLocale(locale as Locale)
- generateMetadata() fetches 'blogsPage' namespace
- Maps articles; calls ArticleCard component for each
- ArticleCard: features category label or featured badge, read time, title, excerpt

Renders:

- SiteHeader (forceSolid)
- PageIntro
- ArticleCard grid (3 columns on md+)
- SiteFooter

Notes:
ArticleCard is an inline component. Uses BLOG_CATEGORY_KEY to map category enum to i18n key. Renders featured label if article.featured, else category label.
