---
kind: section
name: why-baca
file: why-baca.tsx
exports:
  - WhyBaca
imports_from:
  - (none — self-contained, no external imports)
called_by:
  - app/(site)/[locale]/page.tsx
i18n_namespace: (none — all copy is hardcoded)
---

## Purpose

Comprehensive "Why BACA" home section consolidating all trust, process, and compliance content into one cohesive section. Three visual blocks in one semantic `<section>`.

## Used In

Home page (`app/(site)/[locale]/page.tsx`), between `<WhatWeOffer />` and `<FeaturedInsights />`.

## Layout structure

1. **Block 1 — Four Differentiators (cream bg):** Eyebrow + headline + sub-text. 2×2 card grid (single column mobile). Each card: large decorative numeral, title, body copy. Cards hover to `bg-paper`.
2. **Block 2 — How We Work / 5-Step Process (forest dark bg):** "How we work" eyebrow (lime text), headline + summary. Five numbered steps in a three-column grid row (step number | title | body). Dark background with `text-paper` / `text-paper/60` hierarchy.
3. **Block 3 — Certifications (paper/white bg):** Header with eyebrow + headline + subtitle. Six certification boxes in a row (2-col mobile → 3-col sm → 6-col lg). Each box: authority label (saffron), cert name (serif), rule, description. Trust credential strip below the grid.

## Business Logic

- All copy is hardcoded in constant arrays (`DIFFERENTIATORS`, `STEPS`, `CERTS`) — no i18n namespace, no DB.
- `CERTS` array mirrors `constants/sections/certifications.ts` data — keep in sync if cert list changes.
- `STEPS` array mirrors the 5 approach pillars from `messages/en.json → approach.pillars` — keep in sync if process copy changes.
- `DIFFERENTIATORS` mirrors `messages/en.json → profilePage.whyBaca.items` — keep in sync if copy changes.
- Uses semantic Tailwind v4 tokens (`bg-cream`, `bg-forest`, `bg-paper`, `text-ink`, `text-lime`, `text-saffron`) — no hardcoded hex.

## Dependencies

- None beyond Tailwind v4 and the global CSS tokens in `app/globals.css`.

## Impacted Modules

- Any global palette change in `app/globals.css` will affect this section automatically via semantic tokens.
- If `constants/sections/certifications.ts` cert list changes, update `CERTS` array here too.
