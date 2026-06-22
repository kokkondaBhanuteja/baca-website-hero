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
  - 'lucide-react'
  - 'next-intl/server'
  - 'next/navigation'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/utils'
  - '@/lib/server/services/category-service'
  - '@/lib/server/services/product-service'
  - '@/components/ui/cta-link'
  - '@/components/shared/markdown-content'
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
Single product detail page rendered as an **article-style two-column layout**:
a main `<article>` column on the left (back link → title → meta → image
carousel → summary → CTAs → structured attributes → Markdown body) and a
sticky-feel `<aside>` sidebar on the right that lists every published category
(active one highlighted in `text-forest`) and the related products with
thumbnails. The layout matches the blog article reference: thin forest accent
stripe at the very top, a vertical divider between article and sidebar on
`lg+`, single-column stack below `lg`.

Data:

- `getPublishedProductBySlug(slug, locale)` → `ProductDetailPublicDto | null`
  (tagged `PRODUCTS_TAG`). `notFound()` when null.
- `listRelatedProducts(slug, locale)` → `ProductPublicDto[]` (sidebar — sliced
  to 3).
- `getCategoriesForLocale(locale)` → `ProductCategoryPublicDto[]` (sidebar
  categories list; tagged `CATEGORIES_TAG` + `PRODUCTS_TAG`).
- The two list reads run in parallel via `Promise.all` after the product
  fetch.

Business Logic:

- `export const dynamic = 'force-dynamic'` — live with admin edits.
- `generateMetadata()` builds the title from the product name + summary /
  description excerpt.
- **Centered container, generous max-width** (`mx-auto max-w-[1300px] px-5
sm:px-8 lg:px-12`). On a typical laptop viewport this leaves a modest
  margin on each side — the layout reads "slightly off-left" rather than
  centered-in-a-narrow-box or fully edge-hugging.
- **Two-column grid on `lg+`** (`lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]`):
  - LEFT `<article>` carries every product detail. `lg:border-r lg:border-line`
    paints the vertical divider; `lg:pr-12 xl:pr-16` keeps copy off the rule.
  - RIGHT `<aside>` carries the Categories list + the related-products mini
    cards. `min-w-0` on both columns prevents grid blowout from long content.
- **Order within the article column**: back link (`Route.Products`, forest
  green chevron-left) → `<h1>` name → meta row (`botanicalName` in italic
  clay + `|` separator + `categoryName`) → `<ProductGallery>` carousel
  (when `images.length > 0`) → summary as `<h2>` lead → CTA row → optional
  structured sections (origin pills, specs grid, seasonality calendar) →
  Markdown body via `<MarkdownContent>`. Each structured section opens with a
  `border-t border-line pt-8` rule so the article reads as ordered blocks.
- **Sidebar**: Categories `<ul>` (active item matched by
  `category.slug === product.categorySlug`, rendered in `text-forest
font-medium`; siblings in `text-ink/80`). All entries link to
  `Route.Products` — they're navigation back to the catalogue, not filtered
  queries (filtering is not currently implemented at /products). Related
  products render as `<li>` rows with an 80×80 cover `<img>` (matches the
  rest of the codebase's image pattern — `next.config` sets `unoptimized:
true`, and small sidebar thumbnails don't benefit from `next/image`) plus
  name + 2-line clamped summary.
- CTAs: `CtaLink` solid "Request quotation" + outline "Request sample" →
  `Route.Contact`.

Renders:

- SiteHeader (`forceSolid` — page is on `bg-paper`, no dark hero) · forest
  accent stripe · two-column grid:
  - article: back link · h1 · meta · ProductGallery · summary · CTA row ·
    origin pills · spec grid · SeasonalityCalendar · MarkdownContent
  - sidebar: Categories list · related-products mini cards
- CtaBand · SiteFooter

i18n:
Namespace `productsPage`, `detail.*` keys (`products` — back link label,
`categoriesHeading` — sidebar Categories heading, `originRegions`,
`specifications`, `seasonality`, `seasonalityHint`, `harvest`, `peak`,
`requestQuote`, `requestSample`, `pairsNaturally` — sidebar related-products
heading). All keys are translated in every locale under `messages/`.

Accessibility:

- `<article>` + `<aside>` give the page a semantic two-region structure for
  screen readers (main content vs. complementary navigation).
- Back link is a real `<Link>` with text + decorative ChevronLeft.
- `min-w-0` on both grid columns prevents long words from forcing horizontal
  scroll.
- Sidebar thumbnails use empty alt (decorative — the product name beside them
  is the accessible label).

Notes:

- Replaced the prior centered single-column layout and the sticky-image
  two-column attempt with an article/sidebar layout modeled on the blog
  article reference. The full-width "Pairs naturally" related-products grid
  is gone — its content now lives in the sidebar as a 3-row mini list.
- The category sidebar links currently land on the unfiltered `/products`
  grid. If catalogue filtering by category is introduced, switch the `href`
  to a query-string variant.
- Markdown body sits inside the article column (no longer a separate
  narrower section below the hero) so the article reads as one continuous
  flow.
