---
kind: 'component'
name: 'HeroEntry'
file: 'components/sections/hero-entry/hero-entry.tsx'
exports:
  - 'HeroEntry'
imports_from:
  - 'gsap'
---

# HeroEntry

Purpose:
Home-only GSAP entry timeline: header slides down + fades in, then hero-reveal elements stagger up. Runs once on mount; honors reduced motion.

Used In:

- Hero component (wraps the hero content)

Props:

- children: React.ReactNode — the content to animate

Business Logic:

- useEffect on mount; checks (prefers-reduced-motion: reduce)
- If reduce-motion: sets .hero-reveal items to opacity 1 y 0, returns
- If motion allowed: queries document <header> and all [data-hero-reveal] elements
- Builds GSAP timeline with ease: 'power3.out'
- If header exists: animates it from({yPercent: -100, opacity: 0}, duration: 0.5), then chains
- Animates revealItems from({opacity: 0, y: 30}, duration: 0.9, stagger: 0.12, startTime: header ? '-=0.1' : 0) — overlap by 0.1s if header exists
- On unmount: context.revert()

Dependencies:

- React hooks: useEffect, useRef
- gsap

i18n:
None

Accessibility:
No a11y impact.

Notes:
Scoped to the hero: only runs on the home route where the hero renders. The header animation is optional (checks for existence). The revealItems stagger creates a cascading effect. This is the ONLY place [data-hero-reveal] is used (distinct from [data-reveal] which is used by ScrollFX for the rest of home).
