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
Catalogue product card — image (`MediaReveal`) + name + summary, wrapped in a locale-aware `Link`
to the product detail page (`/products/<slug>`). Extracted so the `/products` grid and the detail
page's "Pairs naturally" grid render identical cards.

Used In:

- `app/(site)/[locale]/products/page.tsx` (category grids)
- `app/(site)/[locale]/products/[slug]/page.tsx` ("Pairs naturally" related grid)

Props:

- `product: ProductPublicDto` — resolved `{ id, slug, name, summary, imageUrl }` for the active locale

Business Logic:

- Links to `` `${Route.Products}/${product.slug}` `` via the i18n `Link`.
- Keeps `id={product.slug}` + `scroll-mt-header-offset` so the listing's in-page anchors
  (`/products#green-cardamom`, used by the header nav dropdown) still land correctly.
- Image hover `scale-[1.04]`; title hover `text-clay`. `bg-bone` fallback when `imageUrl` is null.
- Empty `summary` ('' after locale resolution) is falsy → the `<p>` is skipped.

Dependencies:

- `@/i18n/navigation`: Link · `@/constants/routes`: Route · `@/components/ui/media-reveal`: MediaReveal
- `@/lib/shared/types/catalogue-dto`: ProductPublicDto (type only)

i18n:
None — receives already-resolved strings.

Accessibility:
Anchor wraps the whole card; title is an `<h3>` (sits under the section's `<h2>` in both grids).

Notes:
`product-preview` (home) is NOT a consumer — it renders per-category feature rows with product
names as pills, a different shape.
