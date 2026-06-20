---
kind: 'component'
name: 'Hero'
file: 'components/sections/hero/hero.tsx'
exports:
  - 'Hero'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - '@/constants/routes'
  - '@/constants/site'
  - '@/i18n/navigation'
  - '@/components/ui/eyebrow'
  - '@/components/ui/wordmark-letters'
  - '@/components/sections/hero-entry'
---

# Hero

Purpose:
Home hero section: eyebrow + oversized BACA wordmark with per-letter India videos + body text + dual CTA + meta footer (countries/certs count).

Used In:

- Home page — the first/hero section

Props:

- No props — server component

Business Logic:

- Wrapped in HeroEntry (applies entry timeline)
- All major content blocks have data-hero-reveal attribute (trigger HeroEntry stagger)
- WordmarkLetters with HERO_LETTER_VIDEOS (2 Varanasi aarti/flower-garland videos, cycled across BACA letters)
- dual CTAs: Route.Products (saffron) and Route.Contact (outline)
- Footer meta: '75 countries / 3 certifications' (hardcoded translations from t('countries') and t('certs'))
- Flex column, min-h-[100svh], justify-end (content at bottom), overflow-hidden

Dependencies:

- lucide-react: ArrowRight
- next-intl: getTranslations
- @/constants/routes
- @/constants/site: SITE.brand
- @/i18n/navigation: Link
- @/components/ui/eyebrow, wordmark-letters
- @/components/sections/hero-entry: HeroEntry

i18n:
Namespace: 'hero'. Keys: 'eyebrow', 'body', 'ctaProducts', 'ctaContact', 'countries', 'certs'.

Accessibility:
Semantic headings and links.

Notes:
The HERO_LETTER_VIDEOS are hardcoded (2 India clip combos distributed across BACA letters). The meta footer is plain text with '/' divider (aria-hidden). This is the only place Hero section renders; inner pages have PageIntro instead.
