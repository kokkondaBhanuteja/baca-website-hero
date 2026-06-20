---
kind: 'page'
name: 'ProductsPage'
file: 'app/(site)/[locale]/products/page.tsx'
exports:
  - 'generateMetadata'
  - 'dynamic'
  - 'ProductsPage'
  - 'default'
imports_from:
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/lib/server/services/category-service'
  - '@/components/ui/eyebrow'
  - '@/components/ui/media-reveal'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
route: '/[locale]/products'
auth: 'Public'
---

# ProductsPage

Route: `/[locale]/products`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Public

Purpose:
Catalog of products grouped by category. force-dynamic ensures live updates when admins publish/edit products. Displays categories with localized names and product cards with images and summaries.

Data:

- getCategoriesForLocale(locale) — returns categories with nested products, names, descriptions (all localized)

Business Logic:

- export const dynamic = 'force-dynamic' — always fetch fresh from DB
- setRequestLocale(locale as Locale) enables static rendering guard (but overridden by force-dynamic)
- generateMetadata() fetches 'productsPage' namespace
- Renders empty message if categories.length === 0
- Maps categories; maps products within each; displays product.imageUrl or fallback bone bg

Renders:

- SiteHeader (forceSolid)
- Eyebrow, heading, intro text from 'productsPage'
- Category sections (name, description, 3-column product grid)
- ProductCard (image, name, summary)
- SiteFooter

Notes:
force-dynamic required because admin edits must appear immediately on the public site. Fallback bg-bone for missing images. Product cards have id anchors (#slug) for scroll targeting.
