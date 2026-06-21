---
kind: 'component'
name: 'HowWeWork'
file: 'components/sections/profile/how-we-work/how-we-work.tsx'
exports:
  - 'HowWeWork'
imports_from:
  - 'next-intl/server'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
---

# HowWeWork

Purpose:
Profile page — four-step "from soil to shipping" process. Numbered cards
mirror the home page `Approach` pillars (display numeral + heading + body).
Differs from `Approach` by being a server component (no GSAP) — `Reveal`
handles the fade-in.

Used In:

- `app/(site)/[locale]/profile/page.tsx` — after `VisionMission`.

Props:

- No props — async server component.

Business Logic:

- Local `STEPS` array (source / grade / document / ship, numbered 01–04).
  Kept local rather than promoted to `constants/sections/` because the four
  steps are intrinsic to this section's design and not reused elsewhere.
- Anchor: `id="how-we-work"`.

Dependencies:

- `next-intl/server` — `getTranslations`
- `@/components/ui/eyebrow`, `@/components/ui/reveal`

i18n:
Namespace: `profilePage.howWeWork`. Keys: `eyebrow`, `heading`, `intro`,
`steps.{source,grade,document,ship}.{title,body}`.

Accessibility:
Semantic `<section>` + `<h2>` for the section + `<h3>` per step.
Saffron rule above each card is `aria-hidden` (decorative).
