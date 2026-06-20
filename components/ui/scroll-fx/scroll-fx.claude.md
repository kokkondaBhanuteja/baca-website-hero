---
kind: 'component'
name: 'ScrollFX'
file: 'components/ui/scroll-fx/scroll-fx.tsx'
exports:
  - 'ScrollFX'
imports_from:
  - 'gsap'
  - 'gsap/ScrollTrigger'
---

# ScrollFX

Purpose:
Home-only GSAP driver for scroll-triggered reveals and parallax. Targets [data-reveal] (clip-mask entrance) and [data-parallax] (subtle drift on desktop).

Used In:

- Home page (app/(site)/[locale]/page.tsx) only — mounted at page level to trigger animations on home sections

Props:

- No props — pure side-effect component.

Business Logic:

- useEffect on mount; checks (prefers-reduced-motion: reduce)
- If reduce-motion: sets all [data-reveal] elements to clipPath='inset(0 0 0% 0)', y=0, opacity=1 and returns
- If motion allowed: builds GSAP context
- For [data-reveal] elements: gsap.fromTo() animates clipPath 'inset(0 0 100% 0)' → 'inset(0 0 0% 0)', y 28→0, opacity 0→1, duration 1s, ease 'power3.out', ScrollTrigger start 'top 85%'
- For [data-parallax] elements (desktop only, innerWidth >= 1024): gsap.fromTo() animates yPercent -4→4 with scale 1.1, ease 'none', scrollTrigger scrub: true (follows scroll). Trigger is the closest section or the element itself
- On unmount: context.revert()
- Returns null (no DOM)

Dependencies:

- React hook: useEffect
- gsap + gsap/ScrollTrigger — scroll-driven animation

i18n:
None

Accessibility:
No a11y impact.

Notes:
This driver is specific to the home page and only runs there. The [data-reveal] and [data-parallax] attributes are set on home section elements. Parallax is desktop-only (innerWidth >= 1024) for performance. The scrub: true on parallax ties it directly to scroll position (no easing delay).
