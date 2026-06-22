---
kind: 'component'
name: 'ProductCard'
file: 'components/shared/product-card/product-card.tsx'
exports:
  - 'ProductCard'
imports_from:
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/shared/types/catalogue-dto'
  - '@/components/ui/media-reveal'
---

# ProductCard

Purpose:
Catalogue product card — cover image with a region pill badge overlay, then
a cream info panel carrying the product name, an italic clay-toned summary
tagline, and a label/value attribute list rendered from `keySpecs`. Wrapped
in a locale-aware `Link` to the product detail page (`/products/<slug>`).

Used In:

- `app/(site)/[locale]/products/page.tsx` (category grids)

Props:

- `product: ProductPublicDto` — resolved
  `{ id, slug, name, summary, imageUrl, region?, keySpecs? }` for the active
  locale. `region` and `keySpecs` are optional surface-fields populated by
  `getCategoriesForLocale`; other consumers (e.g. sidebar mini-cards on the
  detail page) leave them undefined and the matching slots collapse.

Business Logic:

- Links to `` `${Route.Products}/${product.slug}` `` via the i18n `Link`.
- Keeps `id={product.slug}` + `scroll-mt-header-offset` so the listing's
  in-page anchors (`/products#green-cardamom`, used by the header nav
  dropdown) still land correctly.
- Region pill: `bg-ink/85 text-paper backdrop-blur-sm` rounded-full at
  `start-3 top-3` over the cover. Only renders when `product.region` is
  present (i.e. the product has at least one `originRegions[]` entry).
- Cover: `aspect-[4/3]` inside `<MediaReveal>` for the standard GSAP scroll
  reveal; `bg-bone` fallback when `imageUrl` is null; image hover scales to
  `1.04`.
- Title hover → `text-clay`. Italic summary in `text-clay` directly below
  the title (renders as the tagline). Empty `summary` ('' after locale
  resolution) is falsy → `<p>` is skipped.
- `keySpecs` renders as a `<dl>` of label/value rows under a top border;
  the row hides entirely when the array is empty.

Dependencies:

- `@/i18n/navigation`: Link · `@/constants/routes`: Route ·
  `@/components/ui/media-reveal`: MediaReveal
- `@/lib/shared/types/catalogue-dto`: ProductPublicDto (type only)

i18n:
None — receives already-resolved strings. `keySpecs` labels come from the DB
(admin-controlled; the admin orders specs so the most distinctive attribute
is first).

Accessibility:
Anchor wraps the whole card; title is `<h3>` (sits under the section `<h2>`).
The region pill is plain text inside the anchor — no separate aria role
needed. `<dl>` provides semantic key/value pairing for the attribute rows.

Notes:
The detail page's old "Pairs naturally" full-width grid no longer uses this
card — it was replaced by a sidebar mini-list of related products in the
detail-page redesign. ProductCard is therefore used by exactly one surface
today.
