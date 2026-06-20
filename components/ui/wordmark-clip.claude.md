---
kind: 'helper'
name: 'wordmarkClip'
file: 'components/ui/wordmark-clip.ts'
exports:
  - 'WordmarkAlign'
  - 'WORDMARK_ALIGN_ANCHOR'
  - 'WORDMARK_ALIGN_X'
imports_from: []
---

# wordmark-clip (constants)

Purpose:
Shared placement helpers for the wordmark family: maps the `align` prop to SVG `text-anchor` and x-position within the 1000-unit viewBox the wordmark SVGs share.

Used In:

- `components/ui/wordmark-media/wordmark-media.tsx`
- `components/ui/wordmark-slideshow/wordmark-slideshow.tsx`

Exports:

- `type WordmarkAlign = 'left' | 'center' | 'right'`
- `WORDMARK_ALIGN_ANCHOR: Record<WordmarkAlign, 'start' | 'middle' | 'end'>` — `{ left: 'start', center: 'middle', right: 'end' }`
- `WORDMARK_ALIGN_X: Record<WordmarkAlign, number>` — `{ left: 8, center: 500, right: 992 }`

Business Logic:

- The shared viewBox is `0 0 1000 320`. Center is x=500. Left/right use small insets (8 and 992) so the leftmost / rightmost letter stroke isn't clipped at the viewBox edge.
- SVG `text-anchor` values determine how the `x` coordinate aligns the rendered text relative to the anchor.

Dependencies:
None — pure constants. No React imports, no runtime side effects.

i18n:
None.

Accessibility:
None — pure constants used by the wordmark SVGs (which are themselves `aria-hidden` with a separate `<span class="sr-only">` text label in each consumer).

Notes:

- The reason the file lives at `components/ui/wordmark-clip.ts` (not in its own folder) is that it's a tiny shared types/constants file used by TWO component folders (wordmark-media, wordmark-slideshow). Promoting it to its own folder would mean every consumer changes import paths for marginal gain; per the project's selective per-folder convention, pure constants files stay flat.
