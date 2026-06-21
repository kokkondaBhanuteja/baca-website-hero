---
kind: 'component'
name: 'WhoWeAre'
file: 'components/sections/profile/who-we-are/who-we-are.tsx'
exports:
  - 'WhoWeAre'
imports_from:
  - 'next-intl/server'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
---

# WhoWeAre

Purpose:
Profile page — opening editorial block introducing BACA. Two-column on `lg+`:
left column holds eyebrow + heading, right column holds the body paragraph.
Pure server-rendered text — no client interactivity, just `Reveal` for the
scroll fade-in.

Used In:

- `app/(site)/[locale]/profile/page.tsx` — first section after the PageIntro.

Props:

- No props — async server component.

Business Logic:

- Reads `profilePage.whoWeAre.{eyebrow,heading,body}` via `getTranslations`.
- Anchor: `id="who-we-are"` so the footer/nav can deep-link from
  `${Route.Profile}#who-we-are`.

Dependencies:

- `next-intl/server` — `getTranslations`
- `@/components/ui/eyebrow` — `Eyebrow` saffron-rule label
- `@/components/ui/reveal` — `Reveal` IntersectionObserver fade-up wrapper

i18n:
Namespace: `profilePage.whoWeAre`. Keys: `eyebrow`, `heading`, `body`.

Accessibility:
Semantic `<section>` + `<h2>`. Eyebrow text is a separate `<span>` (handled by
the `Eyebrow` primitive) so screen readers read the heading first.
