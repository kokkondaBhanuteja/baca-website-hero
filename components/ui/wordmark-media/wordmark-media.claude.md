---
kind: 'component'
name: 'WordmarkMedia'
file: 'components/ui/wordmark-media/wordmark-media.tsx'
exports:
  - 'WordmarkMedia'
  - 'WordmarkVideoSource'
imports_from:
  - '@/components/ui/wordmark-clip'
---

# WordmarkMedia

Purpose:
Full-width wordmark revealing a looping video (every.com-style media inside text). Responsive SVG viewBox; video in foreignObject clipped by text path.

Used In:

- Not currently used in production; available for future hero variants or alternative landing sections

Props:

- text?: string — word to render (default: 'BACA')
- videoSources: WordmarkVideoSource[] — array of {src, type} for video sources
- posterSrc: string — poster image URL
- align?: WordmarkAlign — 'left' | 'center' | 'right' (default: 'center')
- className?: string — outer div Tailwind

Business Logic:

- useId() generates clipId; useRef for videoRef
- useEffect: checks (prefers-reduced-motion: reduce) and (max-width: 640px)
- If reduce-motion or small-screen: video.pause() and return
- If normal motion: IntersectionObserver threshold 0.15 plays/pauses video on visibility
- SVG viewBox='0 0 1000 320' with text at y=258, fontSize=370, letterSpacing=-12
- Alignment via WORDMARK_ALIGN_X and WORDMARK_ALIGN_ANCHOR from wordmark-clip.ts
- foreignObject 1000x320 holds the <video> clipped by the text path
- <video> has poster, muted, loop, playsInline, preload='metadata'

Dependencies:

- React hooks: useEffect, useId, useRef
- IntersectionObserver API
- @/components/ui/wordmark-clip — WORDMARK_ALIGN_X, WORDMARK_ALIGN_ANCHOR

i18n:
None

Accessibility:
sr-only <span> with text. SVG aria-hidden. Video is muted.

Notes:
Similar to WordmarkLetters but video-based and single-window (not per-letter). The video is NOT auto-played; it starts on intersection observer trigger. Small screens and reduced-motion prevent autoplay, so the poster frame always shows as fallback.
