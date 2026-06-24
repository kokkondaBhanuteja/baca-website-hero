---
kind: 'component'
name: 'WordmarkMosaic'
file: 'components/ui/wordmark-mosaic/wordmark-mosaic.tsx'
exports:
  - 'WordmarkMosaic'
imports_from:
  - 'react'
  - '@/components/ui/wordmark-clip'
---

# WordmarkMosaic

Purpose:
Oversized wordmark whose letterforms reveal a ROW of images — one texture per
letter (mosaic variant of the "media inside text" family). Optional fading mirror
reflection beneath. Used as the home hero showpiece.

Used In:

- `components/sections/hero/hero.tsx` (home hero — BACA letters filled with
  ocean / port-containers / pepper / ocean bands)

Props:

- text?: string — word to render (default 'BACA')
- images: string[] — one image per vertical band, left→right (≈ one per letter)
- align?: WordmarkAlign — 'left' | 'center' | 'right' (default 'center')
- reflection?: boolean — render a flipped, mask-faded mirror below (default false)
- className?: string — outer div Tailwind (container width sets overall scale)

Business Logic:

- `useId()` → sanitized id; the SVG panel is rendered via a `panel(clipId)` helper
  so the main + reflection SVGs get DISTINCT clip ids (no `url(#id)` collision).
- SVG viewBox '0 0 1000 320'; clipPath `<text>` at y=258, fontSize 370,
  letterSpacing -12, placed via WORDMARK_ALIGN_X / WORDMARK_ALIGN_ANCHOR.
- foreignObject (1000×320) clipped by the text holds a `flex` row of `<img>`s,
  each `flex-1 h-full object-cover` → equal bands, one letter per image.
- Reflection: the same panel wrapped in a div with `[transform:scaleY(-1)]`,
  `-mt-[19%]` (pull up so the mirror meets the baseline), low opacity, and a
  `mask-image` (+ `-webkit-mask-image`) linear-gradient fade to transparent.
- Static (no JS playback / timeline) — unlike `WordmarkMedia` (video) and
  `WordmarkSlideshow` (cross-fade montage).

Dependencies:

- React: `useId`
- `@/components/ui/wordmark-clip`: WORDMARK_ALIGN_X, WORDMARK_ALIGN_ANCHOR, WordmarkAlign

i18n:
None — `text` is a brand proper noun passed by the caller.

Accessibility:
`sr-only` real-text label; both SVGs `aria-hidden`; reflection wrapper `aria-hidden`.
Images are decorative (`alt=""`).

Notes:
Sister to `WordmarkMedia` (single video) and `WordmarkSlideshow` (image montage).
The reflection loads the image set a second time; keep the band count small (≈4).
Letters aren't exactly equal width, so bands are an approximation — letters may
straddle an image seam slightly, which reads as intentional.
