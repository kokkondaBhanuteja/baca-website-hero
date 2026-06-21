---
kind: 'page'
name: 'ProductDetailPage'
file: 'app/(site)/[locale]/products/[slug]/page.tsx'
exports:
  - 'generateMetadata'
  - 'dynamic'
  - 'ProductDetailPage'
  - 'default'
imports_from:
  - 'next-intl/server'
  - 'next/navigation'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/server/services/product-service'
  - '@/components/ui/cta-link'
  - '@/components/shared/product-card'
  - '@/components/shared/media-hero'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
route: '/[locale]/products/[slug]'
auth: 'Public'
---

# ProductDetailPage

Route: `/[locale]/products/[slug]`
Kind: page (Next.js route convention file)
Rendering: Server (force-dynamic)
Auth: Public

Purpose:
Single product detail page — magazine hero + description + Origin/Specifications/Seasonality
attributes + quotation/sample CTAs + "Pairs naturally" related grid. Reachable from the `/products`
cards (and the header nav).

Data:

- `getPublishedProductBySlug(slug, locale)` → `ProductDetailPublicDto | null` (tagged `PRODUCTS_TAG`).
  `notFound()` when null (unknown slug / unpublished product or category).
- `listRelatedProducts(slug, locale)` → `ProductPublicDto[]` (same category first, then recent).

Business Logic:

- `export const dynamic = 'force-dynamic'` — live with admin edits.
- `generateMetadata()` builds the title from the product name + summary/description.
- `MediaHero` shows the cover image, category eyebrow, name, and summary (meta slot).
- Description split on blank lines into `<p>` paragraphs (same approach as the blog body).
- Attributes: an array of `{ label, value, hint }` filtered to present values, rendered as a 3-col `<dl>`
  (seasonality carries the `seasonalityHint` sub-label).
- CTAs: `CtaLink` solid "Request quotation" + outline "Request sample", both → `Route.Contact`.
- Related grid uses the shared `ProductCard`; section also links back to `/products`.

Renders:

- SiteHeader (transparent — dark hero) · MediaHero · description · attributes `<dl>` · CTA row ·
  "Pairs naturally" `ProductCard` grid · SiteFooter

i18n:
Namespace `productsPage`, `detail.*` keys (`backToProducts`, `originRegions`, `specifications`,
`seasonality`, `seasonalityHint`, `requestQuote`, `requestSample`, `pairsNaturally`, `viewAllProducts`).

Notes:
Uses the transparent `SiteHeader` (no `forceSolid`) so the nav floats over the dark full-bleed hero.
