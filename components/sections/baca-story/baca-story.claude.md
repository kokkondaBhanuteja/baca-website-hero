---
kind: section
name: baca-story
file: baca-story.tsx
exports:
  - BacaStory
imports_from:
  - (none — no external dependencies)
called_by:
  - app/(site)/[locale]/page.tsx
i18n_namespace: (none — all copy is hardcoded)
---

## Purpose

Three-block editorial section that tells the BACA origin story, prominently presents the company Vision and Mission, and closes with farmer-connection trust anchors.

## Used In

Home page (`app/(site)/[locale]/page.tsx`), between `<Hero />` and `<BacaPrinciples />`.

## Layout structure

1. **Block 1 — Opening story (cream bg):** Eyebrow, split two-column headline + body paragraph + italic pull quote, then a three-stat strip (75%, 2.5M+, 180+ — sourced to Spices Board of India).
2. **Block 2 — Vision & Mission (forest dark band):** "Our Purpose" label, Vision and Mission as two serif statements side-by-side separated by a hairline divider. Uses `--lime` text on the dark `--forest` background.
3. **Block 3 — Trust close (cream bg):** Farmer connection paragraph on the left; three trust-anchor items (Traceable Origins, Honest Grading, Long-term Partnerships) as a bulleted list on the right.

## Business Logic

- All copy is hardcoded — no i18n namespace, no DB data.
- STATS array holds figures sourced to Spices Board of India; update if official figures change.
- Section uses semantic Tailwind v4 tokens (`bg-cream`, `bg-forest`, `text-ink`, `text-lime`, `border-saffron`, `text-saffron`) — do not revert to hardcoded hex.

## Dependencies

- None beyond Tailwind v4 and the global CSS tokens in `app/globals.css`.

## Impacted Modules

- Any global palette change in `app/globals.css` will affect this section's colours automatically via the semantic token classes.
