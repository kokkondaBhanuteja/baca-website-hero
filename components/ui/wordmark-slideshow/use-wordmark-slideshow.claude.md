---
kind: 'hook'
name: 'useWordmarkSlideshow'
file: 'components/ui/wordmark-slideshow/use-wordmark-slideshow.ts'
exports:
  - 'useWordmarkSlideshow'
imports_from:
  - 'react'
  - 'gsap'
---

# useWordmarkSlideshow

Purpose:
GSAP timeline hook for the wordmark slideshow: manages the 'tide wash' clip-path animation, holds each image, and pauses when off-screen.

Used In:

- `components/ui/wordmark-slideshow/wordmark-slideshow.tsx` (the only consumer — the component that owns the SVG/foreignObject scaffold)

Props (hook signature):

- `rootRef: RefObject<HTMLDivElement | null>` — the SVG container; used to scope `gsap.context()` and as the IntersectionObserver target
- `imageRefs: RefObject<HTMLImageElement[]>` — array of image elements (one per slide); ref callback collects them
- `imageCount: number` — used as the only dependency so the effect re-runs if the consumer swaps the image set

Business Logic:

- Filters out null/undefined slides from `imageRefs.current` on mount.
- Honors `prefers-reduced-motion: reduce` — sets the FIRST slide to `autoAlpha: 1` + `clipPath: 'none'` + `scale: 1.04`, hides the rest, and returns without building the timeline.
- Same single-still fallback when `slides.length === 1`.
- Builds a `gsap.timeline({ repeat: -1, paused: true })` inside `gsap.context(() => …, rootRef)` so all tweens are scoped to the root and can be reverted on cleanup.
- Initial state for every slide: `autoAlpha: 1`, `clipPath: WAVE_HIDDEN`, `scale: 1.2`, `xPercent: 4`, `filter: 'blur(8px)'`, `zIndex: 0`.
- Per-slide cycle (4 stages on the timeline):
  1. **Surge phase 1** — `clipPath: WAVE_HIDDEN → WAVE_MID`, `scale: 1.2 → 1.12`, `xPercent: 4 → 1.5`, `filter: blur(8px) → blur(3px)`, `duration: WASH_SECONDS * 0.55`, `ease: 'power1.in'`.
  2. **Surge phase 2** — `clipPath: WAVE_MID → WAVE_SHOWN`, `scale: 1.06`, `xPercent: 0`, `filter: blur(0)`, `duration: WASH_SECONDS * 0.45`, `ease: 'power2.out'`.
  3. **Previous slide dissolves** — `scale: 1.3`, `filter: blur(6px)`, `autoAlpha: 0`, `duration: WASH_SECONDS`, `ease: 'power2.in'` (scheduled at the same time as surge phase 1 via `surgeAt`).
  4. **Hold (Ken Burns)** — `scale: 1.18`, `xPercent: -2.5`, `duration: HOLD_SECONDS = 3.2s`, `ease: 'sine.inOut'`.
- After the dissolve, the previous slide is reset to the HIDDEN state with `gsap.set(previous, {...})` so it's ready for its next turn.
- `IntersectionObserver` at `threshold: 0.2` on `rootRef.current`: plays the timeline when intersecting, pauses when not — so the loop doesn't waste cycles while the footer is off-screen.
- Cleanup: disconnects the observer and calls `context.revert()` to undo every tween and listener GSAP attached inside the scope.

Wave constants:

- `WAVE_HIDDEN`, `WAVE_MID`, `WAVE_SHOWN` — three 7-point polygons; same point structure so GSAP can interpolate. The right edge is undulating (the crest pattern flips at MID) so the reveal looks like an incoming tide instead of a rigid wipe.

Dependencies:

- `react` (useEffect, RefObject)
- `gsap` (timeline, context, set, fromTo, to)

i18n:
None — pure animation logic.

Accessibility:
None — the hook drives decorative motion only. The consuming component renders the wordmark as `aria-hidden` with a `<span class="sr-only">` for the real text. Reduced motion is respected.

Notes:

- Low-level; not meant to be used independently. Paired exclusively with `WordmarkSlideshow`.
- The `useEffect` dependency is `[imageCount]` only — refs are stable identities, so we suppress `react-hooks/exhaustive-deps` for `rootRef` and `imageRefs` with an inline disable.
- Scoping via `gsap.context()` is critical: it guarantees that the cleanup `revert()` cleans up every tween, even ones added asynchronously via the IntersectionObserver callback.
