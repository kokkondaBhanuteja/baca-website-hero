---
kind: 'component'
name: 'WhyBaca'
file: 'components/sections/profile/why-baca/why-baca.tsx'
exports:
  - 'WhyBaca'
imports_from:
  - 'next-intl/server'
  - '@/constants/sections/why-baca'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
---

# WhyBaca

Purpose:
Profile page — four-up grid of differentiator cards (traceability, lab-tested
quality, reliable logistics, long-term partnership). Each card pairs a lucide
icon, a heading, and a body paragraph. Closes the profile page narrative.

Used In:

- `app/(site)/[locale]/profile/page.tsx` — final section before the footer.

Props:

- No props — async server component.

Business Logic:

- Iterates `WHY_BACA` from `@/constants/sections/why-baca`. The constant
  carries `key` + `icon` (a `LucideIcon`); title + body resolve from
  `profilePage.whyBaca.items.<key>.{title,body}`.
- Grid: 1 column on mobile, 2 on `sm`, 4 on `lg+` so the row of four cards
  reads as a single horizontal "promise strip" on desktop.
- Anchor: `id="why-baca"`.

Dependencies:

- `next-intl/server` — `getTranslations`
- `@/constants/sections/why-baca` — `WHY_BACA` array
- `@/components/ui/eyebrow`, `@/components/ui/reveal`

i18n:
Namespace: `profilePage.whyBaca`. Keys: `eyebrow`, `heading`, `intro`,
`items.<key>.{title,body}` for every entry in `WHY_BACA`.

Accessibility:
Semantic `<section>` + `<ul>/<li>` for the grid. Each card is an `<article>`
with its own `<h3>`. Icons `aria-hidden` (heading carries the meaning).
