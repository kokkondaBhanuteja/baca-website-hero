---
kind: 'component'
name: 'ProductPreview'
file: 'components/sections/product-preview/product-preview.tsx'
exports:
  - 'ProductPreview'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - '@/constants/animations'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/server/services/category-service'
  - '@/components/ui/eyebrow'
  - '@/components/ui/media-reveal'
  - '@/components/ui/reveal'
---

# ProductPreview

Purpose:
DB-driven: fetches published categories and renders them ADAPTIVELY — a single category becomes one
full-width feature row (image + name + product pills + CTA); two or more switch to a 3-column card grid.

Used In:

- Home page (app/(site)/[locale]/page.tsx)

Props:

- No props — server component

Business Logic:

- Calls await getLocale() + await getTranslations('productPreview') + await getTranslations('hero')
- Calls await getCategoriesForLocale(locale), returns null if empty
- `isSingle = categories.length === 1` picks the layout.
- SINGLE → one full-width row: `Link` to Route.Products, `grid lg:grid-cols-2`, image left (`MediaReveal`,
  `lg:min-h-[440px]`, hover `scale-[1.04]`), content right (h3 + description + product pills + CTA arrow).
- MULTI → `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` of category cards: image on top (`aspect-[4/3]`),
  name, 2-line-clamped description, up to 4 product pills, CTA arrow pinned to the bottom (`mt-auto`).
- Each entry wrapped in Reveal with delay `index * REVEAL_STAGGER_MS.PRODUCT_PREVIEW`.

Dependencies:

- lucide-react: ArrowRight
- next-intl: getLocale, getTranslations
- @/constants/animations — REVEAL_STAGGER_MS
- @/constants/routes
- @/i18n/navigation: Link
- @/lib/server/services/category-service: getCategoriesForLocale
- @/components/ui/eyebrow, media-reveal, reveal

i18n:
Namespaces: 'productPreview' (eyebrow, heading), 'hero' (ctaProducts). Dynamic category names from DB.

Accessibility:
Semantic h2, h3, links. Images have alt or decoration.

Notes:
Returns null on empty categories (count-agnostic). Each category can have multiple products displayed as pill badges. The image hover uses duration-baca-slow (custom Tailwind 1.2s or similar) and ease-baca (custom easing curve). This is the showcase for the product catalogue on the home page.
