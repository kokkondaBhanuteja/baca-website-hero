# components/sections/profile/

Public profile-page section group. Mirrors `components/sections/contact/` —
a grouping folder containing the page's individual sections, each in its
own subfolder following the per-component convention.

```
who-we-are/         Editorial body block introducing BACA (eyebrow + heading + body).
vision-mission/     Paired Vision + Mission cards on cream/40 background.
how-we-work/        Four-step "soil → shipping" numbered cards (mirrors home Approach).
founders/           Founders grid — proper-noun names from FOUNDERS constant + translated role/bio + avatar (image or initials fallback).
why-baca/           Four-up differentiator grid driven by WHY_BACA constant + lucide icons.
```

## Composition

`app/(site)/[locale]/profile/page.tsx` renders these in order:

```
PageIntro → WhoWeAre → VisionMission → HowWeWork → Founders → WhyBaca → SiteFooter
```

## Patterns

- **All server components.** No interactivity inside any of the five — they
  call `await getTranslations(ns)` and ship as RSC. The `Reveal` primitive
  provides the entrance fade-in via IntersectionObserver (lightweight client
  island, already established elsewhere).
- **Structure configs in `@/constants/sections/`.** `FOUNDERS` and `WHY_BACA`
  follow the same shape as `PILLARS` / `CERTS` (typed array of `{ key, … }`
  items; section component maps over them and resolves labels by key).
- **No hardcoded text.** Every visible string flows through `profilePage.*`
  translation keys — see `profilePage` namespace in `messages/<locale>.json`.
- **Anchors.** Each section sets a stable `id="…"` so the footer / nav /
  shared links can deep-link with `${Route.Profile}#who-we-are` etc.
