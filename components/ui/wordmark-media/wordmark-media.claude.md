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

- `components/sections/hero/hero.tsx` (the active home hero — single illustrated India film through the BACA letters)

Props:

- text?: string — word to render (default: 'BACA')
- videoSources: WordmarkVideoSource[] — array of {src, type} for video sources
- posterSrc: string — poster image URL
- align?: WordmarkAlign — 'left' | 'center' | 'right' (default: 'center')
- className?: string — outer div Tailwind

Business Logic:

- useId() generates clipId; useRef for videoRef
- useEffect: checks (prefers-reduced-motion: reduce). If reduce-motion: video.pause() and return.
- Otherwise: IntersectionObserver threshold 0.15 plays/pauses video on visibility (same behaviour on mobile and desktop; the markup attributes `muted` + `playsInline` + `loop` satisfy iOS Safari's autoplay rules).
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
Sister to `WordmarkSlideshow` but video-based (single looping clip) rather than image-based. The video is NOT auto-played via the `autoplay` attribute; it starts on IntersectionObserver trigger. Reduced-motion prevents playback (poster still shows). The earlier `max-width: 640px` pause guard was removed so the wordmark plays on mobile — the inline video attributes (`muted` + `playsInline` + `loop`) are exactly what iOS Safari requires for inline autoplay.
