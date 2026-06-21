---
kind: 'component'
name: 'SiteHeader'
file: 'components/layout/site-header/site-header.tsx'
exports:
  - 'SiteHeader'
imports_from:
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/lib/server/services/blog-type-service'
  - '@/lib/server/services/product-service'
  - '@/components/layout/site-header/site-header-client'
---

# SiteHeader

Purpose:
Server wrapper for the header: fetches top-3 products + the first 3 published blog types for the current locale and passes them to SiteHeaderClient as nav dropdown data.

Used In:

- Home page layout, inner pages layout — every public page

Props:

- forceSolid?: boolean — if true, render solid (dark-on-paper) immediately (for inner pages on light bg); if false, start transparent over hero (for home)

Business Logic:

- Calls await getLocale() + Promise.all([listPublishedProducts, listPublishedBlogTypes])
- Maps products → productLinks [{label, href: Route.Products#slug}, ...]
- Maps blogTypes.slice(0,3) → insightLinks [{label, href: Route.Blogs?type=slug}, ...] (Blogs dropdown = first 3 types, each pre-filtering the blogs page)
- Passes forceSolid, productLinks, insightLinks to SiteHeaderClient

Dependencies:

- next-intl/server: getLocale
- @/constants/routes — Route.Products, Route.Blogs
- @/lib/server/services/product-service: listPublishedProducts
- @/lib/server/services/blog-type-service: listPublishedBlogTypes
- @/components/layout/site-header/site-header-client

i18n:
None — fetches translated product names / blog-type names from DB

Accessibility:
No a11y — rendering deferred to SiteHeaderClient

Notes:
This is the server half of a split component. SiteHeaderClient is the interactive client component. The separation allows the server to fetch data without blocking the client's interactivity (e.g., mobile menu toggle state).
