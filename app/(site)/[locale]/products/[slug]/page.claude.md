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
  - '@/components/shared/markdown-content'
  - '@/components/shared/product-card'
  - '@/components/shared/product-gallery'
  - '@/components/shared/seasonality-calendar'
  - '@/components/sections/cta-band'
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
Single product detail page, **single-column / article style**: heading on top, then an image
**carousel** (`ProductGallery`), then CTAs, optional structured attributes (origin-region pills,
specifications grid, 12-month seasonality calendar), a Markdown details body, "Pairs naturally"
related grid, and an enquiry band.

Data:

- `getPublishedProductBySlug(slug, locale)` → `ProductDetailPublicDto | null` (tagged `PRODUCTS_TAG`).
  `notFound()` when null (unknown slug / unpublished product or category).
- `listRelatedProducts(slug, locale)` → `ProductPublicDto[]` (same category first, then recent).

Business Logic:

- `export const dynamic = 'force-dynamic'` — live with admin edits.
- `generateMetadata()` builds the title from the product name + summary/description.
- Breadcrumb: Home / Products / {name}.
- **Single centered column** (`max-w-[800px]`): breadcrumb → heading → `<ProductGallery>` carousel
  (when `images.length > 0`) → CTAs → structured sections → Markdown body. `heading`, `ctaRow`,
  `structuredSections` are extracted JSX. (Replaced the old image-left two-column hero — the user
  wanted the heading on top and images in a carousel below it.)
- `images` come resolved from the service (gallery URLs, falling back to `[imageUrl]` for legacy
  single-image products) and order by the admin's arrangement (cover first).
- Heading = `<h1>` name + italic `botanicalName` subtitle + `summary` lead line. The three structured
  attribute sections render only when their data is non-empty (`hasStructured`):
  - Origin regions → bordered rounded-full pills from `originRegions[]`.
  - Specifications → 2-col `<dl>` of `specs[{label,value}]`.
  - Seasonality → `seasonalityHint` + `<SeasonalityCalendar>` driven by `harvest/peakMonths`.
- CTAs: `CtaLink` solid "Request quotation" + outline "Request sample" → `Route.Contact`.
- **Details section** below the carousel/structured attrs: `description` rendered via `<MarkdownContent>`
  (react-markdown + remark-gfm) when non-empty — admins paste a Markdown body (narrative + a GFM specs
  table). `max-w-[760px]`, mirrors the blog article body. (Replaced the old plain-text paragraph split.)
- "Pairs naturally" related grid (`ProductCard`); then `<CtaBand />` enquiry band before the footer.

Renders:

- SiteHeader (`forceSolid` — page is on `bg-paper`, no dark hero) · breadcrumb · split image/content ·
  origin pills · spec grid · SeasonalityCalendar · CTA row · "Pairs naturally" grid · CtaBand · SiteFooter

i18n:
Namespace `productsPage`, `detail.*` keys (`home`, `products`, `originRegions`, `specifications`,
`seasonality`, `seasonalityHint`, `harvest`, `peak`, `requestQuote`, `requestSample`, `pairsNaturally`,
`viewAllProducts`). Structured attribute VALUES are stored in the DB (not localized).

Notes:
No longer uses `MediaHero` (that stays on the blog page). Fully responsive: the split stacks to one
column below `lg`, the spec grid to one column below `sm`, and the calendar to two rows below `sm`.
