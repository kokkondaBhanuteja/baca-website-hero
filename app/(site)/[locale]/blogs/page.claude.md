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
  - '@/lib/server/services/blog-article-service'
  - '@/lib/server/services/blog-type-service'
  - '@/components/shared/page-intro'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
  - './blogs-filter'
route: '/[locale]/blogs'
auth: 'Public'
---

# BlogsPage

Route: `/[locale]/blogs`
Kind: page (Next.js route convention file)
Rendering: Server (force-dynamic)
Auth: Public

Purpose:
Lists published blog articles with instant client-side filtering by admin-defined
blog type. The server loads articles + published types and hands both to the
`BlogsFilter` client component (pill bar + uniform 3-col grid). force-dynamic
keeps content live with admin edits.

Data:

- listPublishedArticles(locale) — published BlogArticleSummaryDto items (each
  carries `blogType: { slug, name }`, resolved for the locale)
- listPublishedBlogTypes(locale) — published BlogTypePublicDto pills, sorted

Business Logic:

- export const dynamic = 'force-dynamic'
- setRequestLocale(locale)
- generateMetadata() reads the 'blogsPage' namespace
- Renders PageIntro + BlogsFilter (the card grid + filter pills live in the
  client component so filtering needs no reload)

Renders:

- SiteHeader (forceSolid)
- PageIntro
- BlogsFilter (client) — pills + article grid
- SiteFooter

Notes:
The article card markup + filtering moved into the `blogs-filter/` client
component. Category i18n keys (BLOG_CATEGORY_KEY) are gone — the type label
comes from `article.blogType.name`.
