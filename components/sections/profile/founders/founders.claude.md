---
kind: 'component'
name: 'Founders'
file: 'components/sections/profile/founders/founders.tsx'
exports:
  - 'Founders'
imports_from:
  - 'next-intl/server'
  - '@/constants/sections/founders'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
---

# Founders

Purpose:
Profile page — grid of founder cards. Each card combines a proper-noun name
(from the `FOUNDERS` constant), a translated role byline, a translated bio
paragraph, and an avatar — either a `<img>` when `FOUNDERS[i].imageUrl` is
set, or a saffron initials chip as a graceful fallback (mirrors the blog
author byline fallback on `/blogs/[articleSlug]`).

Used In:

- `app/(site)/[locale]/profile/page.tsx` — after `HowWeWork`.

Props:

- No props — async server component.

Business Logic:

- Iterates `FOUNDERS` from `@/constants/sections/founders` (single source of
  truth — names are proper nouns and therefore not translated; role + bio
  resolve from `profilePage.founders.items.<key>.{role,bio}`).
- `imageUrl` is optional on `FounderConfig`. When set, renders the photo with
  an alt string built from `${imageAltPrefix} ${name}` (so screen readers get
  e.g. "Portrait of Founder One" in EN, "Porträt von Founder One" in DE).
- When `imageUrl` is missing, renders a `<span aria-hidden>` with the first
  letter of the name on a saffron-tint chip. The chip is decorative because
  the heading next to it already names the founder.
- Anchor: `id="founders"`.

Dependencies:

- `next-intl/server` — `getTranslations`
- `@/constants/sections/founders` — `FOUNDERS` array
- `@/components/ui/eyebrow`, `@/components/ui/reveal`

i18n:
Namespace: `profilePage.founders`. Keys: `eyebrow`, `heading`, `intro`,
`imageAltPrefix`, `items.<key>.{role,bio}` for every entry in `FOUNDERS`.

Accessibility:
Semantic `<section>` + `<ul>/<li>` for the grid. Each card is an `<article>`.
Photo `alt` includes the localized "Portrait of" prefix; initials chip is
`aria-hidden`.

Notes:
The `<img>` tag intentionally bypasses `next/image` (with an eslint disable
comment) — same pattern as the blog author avatar; founder photos are
typically small + few in number so the gains from `next/image` don't
outweigh the build-config cost. Swap to `next/image` if a real photo set
ever lands.
