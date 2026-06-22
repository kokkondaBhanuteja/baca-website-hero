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
  - '@/components/ui/cta-link'
  - '@/components/sections/hero-entry'
i18n_namespace: 'hero'
---

# Hero

Purpose:
Home hero — GMCT-structured: a single oversized `headline` filling a full-bleed
pale-sage (`bg-mist`, `#d4e9cf`) field, with the headline in deep pine green
(`text-pine`, `#24582a`) and the emphasized word (`<em>`) in the chartreuse
accent (`text-saffron`), + short body copy + dual CTA + a bottom labels/stats
strip (countries / certs).

Used In:

- Home page (`app/(site)/[locale]/page.tsx`)

Props:

- No props — async server component

Business Logic:

- Full-bleed `bg-mist` (pale sage), `min-h-[100svh]`, content vertically centered (`justify-center`)
- Headline rendered via `t.rich('headline', { em })` where `em` maps to a
  `text-saffron` span (inline, not the shared `richTags`); `font-heading`,
  `text-pine` (`#24582a`, deep pine on the light sage). The headline BREAKS OUT
  of the content column to fill the FULL viewport width on ONE line: the
  `<section>` is the `@container` (`container-type: inline-size`) and the h1 is
  `whitespace-nowrap` + `text-[9.6cqw]` (container-width units = full screen) +
  `tracking-[-0.04em]` + `px-4 sm:px-6`, so the ~25-char tagline scales with the
  whole screen, flush edge-to-edge, capped only by `overflow-hidden`. The body /
  CTAs / stats strip stay inside the centered `max-w-content` column.
  (Tagline: "Quality. Trust. Delivered".)
- Wraps content in `HeroEntry` for the one-time GSAP mount timeline on `[data-hero-reveal]` elements
- CTAs use the shared `CtaLink` pill at the default `tone="light"`: `Route.Products` (solid → deep-green pill, lime label, `arrow`) and `Route.Contact` (`variant="outline"`)
- Bottom strip shows `countries` and `certs` translation keys separated by `/`, in muted `text-ink/55`
- The earlier `WordmarkMedia` India-film video showpiece was removed for the GMCT
  typographic structure (the component still exists for reuse elsewhere)

Dependencies:

- react: `ReactNode` (type for the inline `em` rich-text renderer)
- next-intl: `getTranslations('hero')` (+ `t.rich`)
- `@/components/ui/cta-link`: CtaLink (the shared marketing CTA pill)
- `@/components/sections/hero-entry`: HeroEntry

i18n:
Namespace: `hero`. Keys: `headline` (rich, with `<em>`), `body`, `ctaProducts`, `ctaContact`, `countries`, `certs`.

Accessibility:
Semantic `<section>` with a single `<h1>` headline. CTAs are links with visible labels. Decorative `/` separator is `aria-hidden`.

Notes:
The oversized headline is the visual centerpiece; copy + CTAs and the labels/stats
strip sit below in a 12-column grid on large screens, all over the green field.
The home page renders `<SiteHeader />` (no `forceSolid`) so the nav rides
transparent over this hero and goes solid on scroll.
