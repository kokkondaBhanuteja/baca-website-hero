---
kind: 'component'
name: 'WordmarkSlideshow'
file: 'components/ui/wordmark-slideshow/wordmark-slideshow.tsx'
exports:
  - 'WordmarkSlideshow'
imports_from:
  - '@/components/ui/wordmark-clip'
---

# WordmarkSlideshow

Purpose:
Image-based wordmark montage with cinematic stills revealed by GSAP-driven clip-path sweep (tide-wash effect). Each frame washes in left→right with Ken Burns drift during hold.

Used In:

- FooterWordmark (footer ocean wordmark) — the footer BACA with 4 ocean images cycling

Props:

- text?: string — word to render (default: 'BACA')
- images: string[] — URLs for stills (ordered, cycled)
- align?: WordmarkAlign — 'left' | 'center' | 'right' (default: 'center')
- className?: string — outer div Tailwind

Business Logic:

- useId() generates clipId; useRef for rootRef and imageRefs array
- Calls useWordmarkSlideshow(rootRef, imageRefs, images.length) — see use-wordmark-slideshow.ts for GSAP timeline
- SVG viewBox='0 0 1000 320' with text at y=258, fontSize=370, letterSpacing=-12
- Alignment via WORDMARK_ALIGN_X and WORDMARK_ALIGN_ANCHOR
- foreignObject holds a dark bg-ink container with <img> elements, all positioned absolutely
- useWordmarkSlideshow hook manages the GSAP timeline: wave clip-path animation (WAVE_HIDDEN/MID/SHOWN polygons), hold timing, IntersectionObserver pause/play

Dependencies:

- React hooks: useId, useRef
- @/components/ui/wordmark-clip — WORDMARK_ALIGN_X, WORDMARK_ALIGN_ANCHOR
- @/components/ui/wordmark-slideshow/use-wordmark-slideshow — the hook driving animation

i18n:
None

Accessibility:
sr-only <span> with text. SVG aria-hidden.

Notes:
The hook handles all motion; this component just renders the SVG structure. Off-screen, the timeline pauses (IntersectionObserver threshold 0.2). Under reduced-motion or single image, shows first still only without motion.
