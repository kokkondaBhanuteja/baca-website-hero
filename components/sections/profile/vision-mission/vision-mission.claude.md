---
kind: 'component'
name: 'VisionMission'
file: 'components/sections/profile/vision-mission/vision-mission.tsx'
exports:
  - 'VisionMission'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
---

# VisionMission

Purpose:
Profile page — Vision + Mission rendered as two side-by-side cards on `lg+`,
stacked on mobile. Each card has a small lucide icon chip, a heading, and a
body paragraph. Section background is `bg-cream/40` so the cards lift visually.

Used In:

- `app/(site)/[locale]/profile/page.tsx` — after `WhoWeAre`.

Props:

- No props — async server component.

Business Logic:

- Local `cards` array drives the iteration: `[{key:'vision', icon:Compass},
{key:'mission', icon:Target}]`. Each card resolves its title/body from
  `profilePage.visionMission.<key>.{title,body}` via a dynamic
  `Parameters<typeof t>[0]` cast.
- Anchor: `id="vision-mission"`.

Dependencies:

- `lucide-react` — `Compass` (vision), `Target` (mission)
- `next-intl/server` — `getTranslations`
- `@/components/ui/eyebrow`, `@/components/ui/reveal`

i18n:
Namespace: `profilePage.visionMission`. Keys: `eyebrow`, `heading`,
`vision.{title,body}`, `mission.{title,body}`.

Accessibility:
Semantic `<section>` with eyebrow + `<h2>` for section, `<h3>` per card.
Icons are `aria-hidden` since the card heading already names the concept.
