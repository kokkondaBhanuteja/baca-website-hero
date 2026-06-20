---
kind: 'component'
name: 'WordmarkLetters'
file: 'components/ui/wordmark-letters/wordmark-letters.tsx'
exports:
  - 'WordmarkLetters'
  - 'LetterVideo'
imports_from:
  - 'gsap'
---

# WordmarkLetters

Purpose:
Per-letter media montage: each BACA letter is its own image/video window. Letters reveal in staggered wipe-up on scroll; still images drift with Ken Burns, videos play.

Used In:

- Hero section (app/(site)/[locale]/page.tsx) — displays the hero BACA wordmark with India video clips

Props:

- text?: string — brand word to render (default: 'BACA')
- images?: string[] — URLs for still images (cycled per letter, used if videos not provided)
- videos?: LetterVideo[] — array of {sources: [{src, type}], poster}, one per letter (takes precedence over images)
- className?: string — outer div Tailwind

Business Logic:

- Splits text into letters; computes useVideo = Boolean(videos?.length > 0)
- useEffect: selects [data-letter] panels, checks (prefers-reduced-motion: reduce) and window.matchMedia('(max-width: 640px)')
- If reduce-motion: returns early (no animation)
- If motion allowed: builds GSAP context with gsap.set(), gsap.to() timelines
- Initial state: panels autoAlpha 0, yPercent 26, clipPath 'inset(100% 0% 0% 0%)' (top-to-bottom masked)
- Still images animate with Ken Burns: scale 1.14 over 7+index\*1.3 seconds, repeat -1, yoyo: true
- Reveal timeline: autoAlpha 0→1, yPercent 26→0, clipPath inset(100%)→inset(0%), duration 1.1s, ease 'power3.out', stagger 0.16s (ENTRY_STAGGER)
- IntersectionObserver threshold 0.25: plays timeline + videos on intersect; pauses videos when off-screen
- Small screens (max-width 640px): videos do not autoplay (paused on mount)
- SVG uses foreignObject with video or img clipped by text shape (SVG <clipPath>)

Dependencies:

- React hooks: useEffect, useId, useRef
- gsap — animation library
- IntersectionObserver API

i18n:
None — text is brand name (not translated)

Accessibility:
sr-only <span> with text for screen readers. SVG is aria-hidden with decorative visual. Videos are muted, loop, playsInline.

Notes:
Videos cycle if there are fewer than 4; images cycle similarly. Ken Burns is only applied to still images (not videos, which drive their own motion). Desktop video playback is paused initially and only starts when the section intersects (threshold 0.25). On small screens or reduced motion, videos never play.
