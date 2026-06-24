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
Home hero — editorial copy on the left and the giant `BACA` wordmark on the right, its
letterforms revealing a single looping film (`WordmarkMedia` over `/videos/footer-v1.mp4`)
with a fading mirror reflection. Below sits a full-width feature band. The wordmark is
visible at EVERY breakpoint — full-width and centred when the layout stacks (mobile/tablet),
the larger right column on `lg+`.

Used In:

- Home page (`app/(site)/[locale]/page.tsx`), which renders `<SiteHeader lightHero />`
  above it (the header blends into this light hero at the top, then turns forest-green on scroll).

Props:

- No props — async server component.

Business Logic:

- `<section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-paper">`;
  inner wrapper is `mx-auto flex w-full max-w-[1600px] flex-1 flex-col` with TWO stacked
  regions: the main copy/wordmark grid (`flex-1`) and the feature band below it.
- Main grid: one column below `lg`, `lg:grid-cols-[minmax(440px,0.85fr)_minmax(0,1fr)]`
  (copy column has a 440px floor so the two CTA pills never wrap on desktop; the wordmark
  column is larger). `content-center items-center` centres the block in the `flex-1` space
  so tablet/mobile get balanced top+bottom breathing room (no eyebrow-crowding under the
  fixed header). Grid children carry `min-w-0` to prevent overflow blowout. `pt-header-base`
  clears the fixed header.
  - Left column (`min-w-0 max-w-xl`): eyebrow — two mono lines, `text-forest/80`; a short
    `bg-forest/40` divider dash ABOVE the headline; headline via `t.rich('headline', { em, br })`
    (en string is three lines `Quality.<br/>Trust.<br/><em>Delivered.</em>`), base
    `text-forest`, the `<em>` ("Delivered.") muted `text-forest/40`; body copy; two `CtaLink`s
    (`tone="light"`, `size="lg"`) — `Route.Products` (solid) + `Route.Contact` (outline),
    stacked on mobile (`flex-col sm:flex-row`).
  - Right column (`min-w-0`, always `flex`): `WordmarkMedia` with `videoSources=HERO_VIDEO_SOURCES`
    (`/videos/footer-v1.mp4`), `posterSrc="/images/footer/ocean-1.jpg"`, `align="center"`,
    `reflection`. Responsive width: `mx-auto w-full max-w-[380px] sm:max-w-[520px] lg:mx-0
lg:max-w-[700px] lg:translate-y-4` — centred when stacked, left-anchored and nudged down
    on `lg`.
- Feature band: `mt-10 … border-t border-line pb-10 pt-8`, a full-width grid
  `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` holding FOUR cells — the three `HERO_FEATURES`
  (local `{ title, body }` array) and a closing tagline cell ("Built on Trust. / Delivered
  Globally." mono). WORDS ONLY, no icons: each cell opens with a short `bg-forest` accent rule
  (echoing the headline dash) then title + supporting line (the tagline uses a full-strength
  rule + mono caps). On `lg` the cells are separated by vertical hairlines (`lg:border-l
lg:border-line lg:px-8`, first cell `lg:first:border-l-0`).
- Wrapped in `HeroEntry` for the one-time GSAP mount timeline on `[data-hero-reveal]`
  (eyebrow, divider, headline, body, CTAs, wordmark column, and the feature band).

Assets:

- Wordmark film: `/videos/footer-v1.mp4` (ship/ocean footage), poster `/images/footer/ocean-1.jpg`.
  NOTE: the file is ~45 MB and now also loads on mobile — compressing it (≤5 MB, 720p) is a
  recommended follow-up for mobile data / LCP. `WordmarkMedia` keeps it muted/inline and
  pauses it off-screen via IntersectionObserver.

Dependencies:

- react: `ReactNode` (inline `em` rich-text renderer type)
- next-intl: `getTranslations('hero')` (+ `t.rich`)
- `@/constants/routes`: `Route` (CTA targets)
- `@/constants/site`: `SITE` (`SITE.brand` → the wordmark text)
- `@/components/ui/cta-link`: CtaLink (shared marketing CTA pill)
- `@/components/ui/wordmark-media`: WordmarkMedia (single film through the letters + reflection)
- `@/components/sections/hero-entry`: HeroEntry

i18n:
Namespace: `hero`. Keys used: `headline` (rich, `<em>` / `<br>`), `body`, `ctaProducts`,
`ctaContact`. The eyebrow, feature strip, and tagline are presentational English copy in the
component (not yet in the catalog). The en `headline` is three lines; other locales keep their
existing value (parity is by key, not value).

Accessibility:
Semantic `<section>` with a single `<h1>`. CTAs are links with visible labels. `WordmarkMedia`
exposes a visually-hidden real-text "BACA" label and marks its SVG/video `aria-hidden`; under
reduced-motion the video stays paused (poster shows). The feature bar is plain text (no icons);
accent rules are `aria-hidden`.

Notes:
`WordmarkMosaic` (per-letter image fill) and `WordmarkSlideshow` still exist for reuse
elsewhere; this hero uses the single-film `WordmarkMedia`. `hero-slideshow` also remains in
this folder but is no longer imported.
