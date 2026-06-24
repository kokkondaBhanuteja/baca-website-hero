---
kind: 'component'
name: 'Hero'
file: 'components/sections/hero/hero.tsx'
exports:
  - 'Hero'
imports_from:
  - 'react'
  - 'next-intl/server'
  - 'lucide-react'
  - '@/constants/routes'
  - '@/constants/site'
  - '@/components/ui/cta-link'
  - '@/components/ui/wordmark-mosaic'
  - '@/components/sections/hero-entry'
i18n_namespace: 'hero'
---

# Hero

Purpose:
Home hero — a two-column split on `lg+`: editorial copy on the left and, on the
right, the giant `BACA` wordmark whose four letters each reveal a different texture
(`WordmarkMosaic`) with a fading mirror reflection and a sub-tagline. Below `lg`
the grid stacks (copy, then wordmark).

Used In:

- Home page (`app/(site)/[locale]/page.tsx`)

Props:

- No props — async server component

Business Logic:

- `<section className="overflow-hidden bg-paper">`; inner wrapper is a
  `flex min-h-[100svh] max-w-[1640px] flex-col` with TWO stacked regions: the main
  copy/wordmark grid (`flex-1`) and a full-width feature bar below it.
- Main grid: one column below `lg`, `lg:grid-cols-[minmax(440px,0.46fr)_minmax(0,1fr)]`
  (copy column has a 440px floor so the two CTA pills never wrap on desktop; wide
  wordmark), `items-center`.
  - Left column: eyebrow — two mono lines, `text-forest/80`; a short `bg-forest/45`
    divider dash ABOVE the headline; headline via `t.rich('headline', { em, br })`
    (en string is three lines `Quality.<br/>Trust.<br/><em>Delivered.</em>`), base
    `text-forest`, the `<em>` ("Delivered.") muted `text-forest/40`; body copy; two
    `CtaLink`s (`tone="light"`, `size="lg"`) — `Route.Products` (solid) +
    `Route.Contact` (outline), stacked on mobile (`flex-col sm:flex-row`).
  - Right column (`hidden lg:flex`): `WordmarkMosaic` with `images={HERO_WORDMARK_IMAGES}`
    (one texture per letter, left→right: `/images/footer/ocean-2.jpg`,
    `/images/global-port.jpg`, `/images/product-malabar-black-pepper.jpg`,
    `/images/footer/ocean-1.jpg`), `align="center"`, `reflection`. Hidden below `lg`.
- Feature bar: a full-width grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` holding
  FOUR cells — the three `HERO_FEATURES` (local `{ icon, title, body }` array; icons
  `Leaf` / `ShieldCheck` / `Landmark` in `bg-bone` circles) and a tagline cell
  ("Built on Trust. / Delivered Globally." mono + `bg-forest` underline). On `lg`
  the cells are separated by vertical hairlines (`lg:border-l lg:border-line lg:px-8`,
  first cell `lg:first:border-l-0`).
- Wrapped in `HeroEntry` for the one-time GSAP mount timeline on `[data-hero-reveal]`
  (eyebrow, divider, headline, body, CTAs, wordmark column, and the feature bar).

Assets:

- The four band images are existing `/public/images` assets — swap by editing the
  `HERO_WORDMARK_IMAGES` array. Letters are ≈ equal bands, so order = B/A/C/A.

Dependencies:

- react: `ReactNode` (inline `em` rich-text renderer type)
- next-intl: `getTranslations('hero')` (+ `t.rich`)
- lucide-react: `Leaf`, `ShieldCheck`, `Landmark` (feature icons)
- `@/constants/routes`: `Route` (CTA targets)
- `@/constants/site`: `SITE` (`SITE.brand` → the wordmark text)
- `@/components/ui/cta-link`: CtaLink (shared marketing CTA pill)
- `@/components/ui/wordmark-mosaic`: WordmarkMosaic (per-letter image fill + reflection)
- `@/components/sections/hero-entry`: HeroEntry

i18n:
Namespace: `hero`. Keys used: `headline` (rich, `<em>` / `<br>`), `body`, `ctaProducts`,
`ctaContact`. The eyebrow, feature strip, and tagline are presentational English
copy in the component (not yet in the catalog). The en `headline` is three lines;
other locales keep their existing two-line value (parity is by key, not value).

Accessibility:
Semantic `<section>` with a single `<h1>`. CTAs are links with visible labels.
`WordmarkMosaic` exposes a visually-hidden real-text "BACA" label and marks its SVGs
`aria-hidden`. Feature icons are decorative; the title/body text carries meaning.

Notes:
Replaced the earlier `WordmarkMedia` (single ocean video) hero. `WordmarkMedia` and
`WordmarkSlideshow` still exist for reuse elsewhere; `hero-slideshow` also remains in
this folder but is no longer imported.
