---
kind: 'component'
name: 'MediaHero'
file: 'components/shared/media-hero/media-hero.tsx'
exports:
  - 'MediaHero'
imports_from:
  - 'react'
  - '@/components/ui/eyebrow'
---

# MediaHero

Purpose:
Full-bleed editorial hero shared by the product-detail and article-detail pages — a cover image
under a dark bottom gradient with an overlaid `Eyebrow`, an oversized H1 title, and a meta slot.
The two pages differ only in what they pass as `children`.

Used In:

- `app/(site)/[locale]/products/[slug]/page.tsx` (eyebrow = category, meta = summary)
- `app/(site)/[locale]/blogs/[articleSlug]/page.tsx` (eyebrow = category, meta = author + date + read time)

Props:

- `imageUrl: string | null` — full-bleed background (delivery URL); falls back to a `bg-bone` panel
- `imageAlt: string`
- `eyebrow: string` — small mono label above the title
- `title: string`
- `children?: ReactNode` — meta row under the title

Business Logic:

- `min-h-[68svh]`, image `absolute inset-0 -z-10 object-cover`, plus a `bg-gradient-to-t from-ink/85`
  legibility wash so the light text stays readable over any image.
- Content sits in a `max-w-content` container with `pt-header-base` so it clears the fixed header;
  the page renders the **transparent** `SiteHeader` (no `forceSolid`) — the dark image keeps the
  light nav legible, matching the home-hero treatment.
- Server-component-safe (no hooks, no `'use client'`).

Dependencies:

- `@/components/ui/eyebrow`: Eyebrow (saffron rule + mono label).

i18n:
None — receives already-resolved strings (eyebrow/title) and a meta slot from the caller.

Accessibility:
Semantic `<section>` + single `<h1>`. Image has a real `alt`; the gradient is `aria-hidden`.

Notes:
Plain `<img>` (not `MediaReveal`) because the hero is above the fold — no scroll-reveal needed.
Direction-agnostic: text is start-aligned and inherits the document direction for RTL.
