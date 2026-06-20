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
DB-driven: fetches published categories and renders each as a full-width feature row with image + name + products list + CTA.

Used In:

- Home page (app/(site)/[locale]/page.tsx)

Props:

- No props — server component

Business Logic:

- Calls await getLocale() + await getTranslations('productPreview') + await getTranslations('hero')
- Calls await getCategoriesForLocale(locale), returns null if empty
- Maps categories; each wrapped in Reveal with delay: index \* REVEAL_STAGGER_MS.PRODUCT_PREVIEW
- Each category: Link to Route.Products with group class + grid lg:grid-cols-2
- Left (image): MediaReveal with category.imageUrl or bone placeholder, aspect-[16/11] mobile, lg:min-h-[440px], scale-[1.04] on hover duration-baca-slow ease-baca
- Right (content): h3 + optional description + products list (ul flex flex-wrap gap-2 with pill badges) + CTA arrow text
- CTA: inline-flex group-hover:text-clay transition

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
