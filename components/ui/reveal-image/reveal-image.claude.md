---
kind: 'component'
name: 'RevealImage'
file: 'components/ui/reveal-image/reveal-image.tsx'
exports:
  - 'RevealImage'
imports_from:
  - 'gsap'
  - 'gsap/ScrollTrigger'
---

# RevealImage

Purpose:
Lusion/Dribbble-style cinematic image reveal: clip-path wipe paired with a scale-down settle from 1.1→1 as the image enters viewport.

Used In:

- Manifesto section (the 'who we are' image)

Props:

- src: string — image URL
- alt: string — alt text
- className?: string — wrapper div Tailwind (e.g., aspect-[4/5], rounded-2xl, border)

Business Logic:

- useEffect: checks (prefers-reduced-motion: reduce); if true, returns early (no animation)
- If motion allowed: builds a GSAP timeline with ScrollTrigger start: 'top 82%'
- Animates wrapper: clipPath 'inset(0 0% 0 0)' (left-to-right wipe), duration 1.1s, ease 'power3.inOut', delay=-0.1 to start overlap
- Simultaneously animates image: scale 1 (from 1.1 on .reveal-img CSS), duration 1.4s, ease 'power3.out', at position 0 (same time as wrapper)
- On unmount: scrollTrigger.kill() + timeline.kill()
- Initial state set in CSS class .reveal-img (overflow: hidden, scale: 1.1 from inline style)

Dependencies:

- React hooks: useEffect, useRef
- gsap + gsap/ScrollTrigger — scroll-driven timeline

i18n:
None

Accessibility:
Standard img alt text required

Notes:
Differs from MediaReveal: this one animates BOTH the container (clip-path) and the image (scale) together as a cinematic sequence. The .reveal-img CSS class must set initial overflow: hidden and scale. Used sparingly for hero-style image reveals (like the 'why we're here' section).
