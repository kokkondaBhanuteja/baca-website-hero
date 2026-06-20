# components/ui/

Presentational primitives — zero page copy, reusable everywhere. **Every primitive
lives in its own folder** (`<name>/<name>.tsx` + `<name>/<name>.claude.md` +
`<name>/index.ts` barrel). Read the per-component `.claude.md` for purpose, props,
and dependencies; this file is just the map.

```
button/                 Pill button primitive (variants via class-variance-authority).
cursor/                 Magnetic desktop cursor — mounted ONCE in (site)/[locale]/layout.tsx.
dropdown/               Custom select with full keyboard nav. Replaces native <select> everywhere.
eyebrow/                Saffron rule + uppercase mono label above section headings.
language-switcher/      Locale picker built on Dropdown.
media-reveal/           GSAP clip-path + opacity scroll reveal for content images.
reveal/                 IntersectionObserver fade-up wrapper (used by stagger lists).
reveal-image/           Lusion-style clip-path wipe + scale settle for hero-style images.
rich/                   next-intl rich-text tag map (e.g. `<saffron>…</saffron>` accents).
scroll-fx/              Home-only [data-reveal]/[data-parallax] GSAP driver.
skeleton/               Animated placeholder block — used by every loading.tsx.
wordmark-media/         Video-based wordmark clip (the hero BACA wordmark with India film).
wordmark-slideshow/     Image-based wordmark montage (footer BACA + 404 "404"); GSAP timeline
                        in sibling use-wordmark-slideshow.ts hook.
wordmark-clip.ts        Shared SVG text-anchor + x-position constants (no folder — pure types).
```

## Patterns

- **Single responsibility.** Each primitive does one thing. Composition happens in
  `sections/` or pages, not here.
- **Reduced motion** is honored everywhere there's motion (cursor, reveal, media-reveal,
  wordmark-slideshow). Hidden initial states are inline so the page never flashes.
- **No localization inside ui/.** Primitives take text via props; the caller resolves
  translations. The only exception is `LanguageSwitcher`, which is about locale itself.
- **Imports use absolute `@/components/ui/<name>`** — the folder's `index.ts` barrel
  re-exports from the `.tsx` so import paths stay stable across refactors.
