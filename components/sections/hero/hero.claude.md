---
kind: 'component'
name: 'Hero'
file: 'components/sections/hero/hero.tsx'
exports:
  - 'Hero'
imports_from:
  - 'next-intl/server'
  - '@/constants/routes'
  - '@/constants/site'
  - '@/components/ui/cta-link'
  - '@/components/ui/wordmark-media'
  - '@/components/sections/hero-entry'
i18n_namespace: 'hero'
---

# Hero

Purpose:
Home hero — WordmarkMedia showpiece (illustrated India film through BACA letters) + body copy + dual CTA + meta strip (countries / certs).

Used In:

- Home page (`app/(site)/[locale]/page.tsx`)

Props:

- No props — async server component

Business Logic:

- `HERO_VIDEO_SOURCES` points at `/videos/hero-v5.mp4` with poster `/images/hero-v4-poster.jpg`
- Wraps content in `HeroEntry` for the one-time GSAP mount timeline on `[data-hero-reveal]` elements
- CTAs use the shared `CtaLink` pill: `Route.Products` (solid, `arrow`) and `Route.Contact` (`variant="outline"`)
- Meta strip shows `countries` and `certs` translation keys separated by `/`

Dependencies:

- next-intl: `getTranslations('hero')`
- `@/components/ui/cta-link`: CtaLink (the shared marketing CTA pill)
- `@/components/ui/wordmark-media`: WordmarkMedia
- `@/components/sections/hero-entry`: HeroEntry
- `@/constants/site`: SITE.brand for wordmark text

i18n:
Namespace: `hero`. Keys: `body`, `ctaProducts`, `ctaContact`, `countries`, `certs`.

Accessibility:
Semantic `<section>`. CTAs are links with visible labels. Decorative `/` separator is `aria-hidden`.

Notes:
The wordmark video is the visual centerpiece; copy and CTAs sit below in a 12-column grid on large screens.
