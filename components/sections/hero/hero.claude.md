---
kind: 'component'
name: 'Hero'
file: 'components/sections/hero/hero.tsx'
exports:
  - 'Hero'
imports_from:
  - 'react'
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
Home hero — a two-column split on `lg+`: editorial copy on the left (eyebrow,
oversized headline, saffron divider, body, dual CTA) and, on the right, the giant
`BACA` wordmark whose letterforms reveal a looping ocean film (`WordmarkMedia`,
"media inside text"). Below `lg` the right column is hidden and only the copy shows.

Used In:

- Home page (`app/(site)/[locale]/page.tsx`)

Props:

- No props — async server component

Business Logic:

- `<section className="bg-white">`; inner `grid min-h-[100svh] grid-cols-1 lg:grid-cols-2`,
  offset below the header with `pt-header-base`.
- Left column (`justify-center`): eyebrow (mono, tracked), headline via
  `t.rich('headline', { em, br })` where `em` → a muted `text-ink/50` span and `br` → `<br/>`;
  a `bg-saffron` divider; body copy; and two `CtaLink`s (`tone="light"`, `size="lg"`):
  `Route.Products` (solid) and `Route.Contact` (outline).
- Right column (`hidden lg:flex items-center`): `WordmarkMedia` renders `SITE.brand`
  ("BACA") at full container width, `align="center"`. The letterforms clip a looping
  `<video>` — `HERO_VIDEO_SOURCES = [{ src: '/videos/hero-ocean.mp4', type: 'video/mp4' }]` —
  with `posterSrc="/images/footer/ocean-1.jpg"` shown before/without playback and under
  prefers-reduced-motion. There is no opaque card frame: only the ocean shows through the
  letters, the page background shows elsewhere.
- Whole thing wrapped in `HeroEntry` for the one-time GSAP mount timeline on `[data-hero-reveal]`
  elements (each copy block + the wordmark column carry that attribute).

Assets:

- Ocean video: `/public/videos/hero-ocean.mp4` (must be added — warm/full-frame footage
  reads best through the letters; see `docs/superpowers/specs/wordmark-video-prompt.json`
  for the spec, adapted to ocean). Poster: `/public/images/footer/ocean-1.jpg`.
- To swap the film, edit `HERO_VIDEO_SOURCES` / `posterSrc` in `hero.tsx`.

Dependencies:

- react: `ReactNode` (type for the inline `em` rich-text renderer)
- next-intl: `getTranslations('hero')` (+ `t.rich`)
- `@/constants/routes`: `Route` (CTA targets)
- `@/constants/site`: `SITE` (`SITE.brand` → the wordmark text)
- `@/components/ui/cta-link`: CtaLink (the shared marketing CTA pill)
- `@/components/ui/wordmark-media`: WordmarkMedia (video-in-text BACA wordmark)
- `@/components/sections/hero-entry`: HeroEntry

i18n:
Namespace: `hero`. Keys used: `headline` (rich, with `<em>` / `<br>`), `body`, `ctaProducts`,
`ctaContact`. (`countries` / `certs` exist in the catalog but are not currently rendered here.)

Accessibility:
Semantic `<section>` with a single `<h1>` headline. CTAs are links with visible labels.
`WordmarkMedia` exposes a visually-hidden real-text "BACA" label and marks the SVG `aria-hidden`.

Notes:
The previous full-bleed centered wordmark hero and the right-column `HeroSlideshow`
image carousel were both replaced by this split layout. `HeroSlideshow` still lives in
this folder (`./hero-slideshow`) but is no longer imported by `hero.tsx`.
