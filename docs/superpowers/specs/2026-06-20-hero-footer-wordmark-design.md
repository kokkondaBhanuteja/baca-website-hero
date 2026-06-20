# Hero / Footer Wordmark Showpiece + Entry Motion — Design Spec

**Date:** 2026-06-20
**Status:** Approved (brainstorming) → ready for implementation plan
**Base branch:** `main`

## 1. Goal

Give BACA an entry experience that makes a first-time client feel the brand is
established and origin-authentic within the first frame. The centerpiece is a
**giant `BACA` wordmark with Indian spice-heritage video showing through the
letterforms** (the every.com footer treatment), combined with an **on-load entry
animation where the nav is visible immediately** (the everyegg.com load feel).

The deliverable is an **A/B**: two branches off `main` so the client can compare
**where the showpiece lives** — in the hero, or in the footer.

## 2. References (studied)

- **every.com** — footer: a full-width `EVERY` wordmark with an iridescent gradient
  texture clipped _inside_ the letters. This is the showpiece treatment we adapt
  (warm spice video instead of holographic foil).
- **everyegg.com** — WordPress/Elementor; nav is fixed/visible from the first frame,
  hero block reveals on load with staged fade/slide-up (Elementor entrance animations).
  This is the entry-motion feel.

## 3. Creative direction (locked)

- Letterforms are filled with **real, looping Indian spice-heritage footage**
  (turmeric pouring, chilli drying yard, hands sorting, market) — authentic over AI,
  consistent with the project's provenance principle.
- Asset source: **Pexels / Coverr** (free, commercial license). 2–3 candidate clips,
  best one shipped. Compressed for web (`.webm` + `.mp4` fallback, target < 2.5 MB,
  ~6–8 s seamless loop). Poster still for first paint / reduced-motion / slow connection.
- Tone stays warm/organic and on-brand — never neon/holographic.

## 4. Architecture

### 4.1 Shared primitive — `components/ui/wordmark-media.tsx`

The single reusable showpiece, used by **both** branches (hero and footer).

- Renders the word (`BACA`) as an inline SVG whose `<text>` defines a `clipPath`
  (`clipPathUnits="objectBoundingBox"` or a viewBox matched to the media box) so the
  letters clip a full-bleed looping `<video>` underneath: `clip-path: url(#baca-clip)`.
- **Layering:** `<video>` (clipped to letters) sits above a fallback fill; the letters
  reveal the moving footage, the counters/negative space reveal the page background.
- **Fallbacks (never a blank/black box):**
  - `<video poster="…">` so a still shows before play and if the video fails.
  - `prefers-reduced-motion` or coarse-pointer/small viewport → render the poster still
    (or a warm saffron→terracotta CSS gradient) inside the same text clip; no playback.
  - `<video muted loop playsInline autoPlay preload="metadata">`; pause via
    IntersectionObserver when off-screen.
- **Props:**
  - `text: string` (default `"BACA"`)
  - `videoSources: { src: string; type: string }[]`
  - `posterSrc: string`
  - `reveal: 'mount' | 'scroll'` — entry trigger (hero = `mount`, footer = `scroll`)
  - `className?` / sizing via the consumer.
- **Reveal:** a fade + rise (+ optional saffron sheen sweep) on the wrapper. We do NOT
  animate a second competing `clip-path` for the wipe — the text clip is static; the
  reveal animates `opacity`/`transform` (and an overlay sheen), to avoid clip-path
  conflicts. `'use client'` (needs IntersectionObserver / mount effect / matchMedia).

### 4.2 Entry choreography (Branch A only)

GSAP timeline on mount (GSAP + Lenis already present via `components/ui/scroll-fx.tsx`):

1. **Nav reveals first** (~350 ms): header slides/fades down so it is present from the
   first frame. Scoped to the home load (so it doesn't replay on every route).
2. **Wordmark** rises + fades in (`WordmarkMedia reveal="mount"`), saffron sheen sweep.
3. **Eyebrow → body → CTAs → foot strip** stagger up (everyegg load feel).

`prefers-reduced-motion` → all elements final/visible, timeline skipped.

### 4.3 Nav-visible-on-entry

The site header already overlays the hero (transparent → solid on scroll). Branch A
adds a one-time on-load reveal of the header, scoped so it ties to the hero entry on the
home route. No change to nav structure or links.

## 5. The two branches (A/B, both off `main`)

| Branch                        | Change                                                                                                                                                                                                   | Untouched |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `feat/hero-wordmark-entry`    | Rebuild `components/sections/hero.tsx` around `WordmarkMedia` as the centerpiece; add the mount entry timeline + scoped nav reveal. Keep eyebrow/body/CTAs/foot strip, restructured around the wordmark. | Footer    |
| `feat/footer-wordmark-reveal` | Upgrade the existing giant `BACA` in `components/layout/site-footer.tsx` to `WordmarkMedia` (`reveal="scroll"`), video filling the letters, revealed when the footer enters view.                        | Hero      |

`WordmarkMedia` + the video/poster assets are common to both; each branch carries them
(the footer branch only needs the primitive + assets, not the hero timeline).

## 6. Files

**New (both branches):**

- `components/ui/wordmark-media.tsx` — the primitive.
- `public/videos/spice-heritage.webm` + `.mp4` — looping footage.
- `public/images/wordmark-poster.jpg` — poster still.

**Branch A edits:** `components/sections/hero.tsx`, header client (scoped load reveal),
possibly `app/globals.css` (sheen keyframe / reduced-motion guard).

**Branch B edits:** `components/layout/site-footer.tsx`, possibly `app/globals.css`.

## 7. Constraints / conventions

- TypeScript strict, no `any`; descriptive names (no single-letter identifiers).
- Custom components only; no native `<select>` (N/A here but noted).
- Accessibility: video is decorative → `aria-hidden`; the word `BACA` available to
  screen readers as real text (SVG `<title>`/visually-hidden text); contrast unaffected
  (letters over page bg). Honor `prefers-reduced-motion`. Tap targets unaffected.
- Performance: `preload="metadata"`, pause off-screen, compressed assets, poster-first.

## 8. Verification (each branch)

- `pnpm lint` + `pnpm build` green (strict TS, `ignoreBuildErrors: false`).
- Nav visible from first paint; entry timeline plays once (Branch A).
- Letters show motion; poster shows on reduced-motion / slow connection / mobile.
- No layout shift (CLS) from the SVG/video swap.
- Playwright screenshot of each branch for the client to compare placement.

## 9. Out of scope

- AI-generated video (deferred; real stock chosen).
- Localization of the wordmark (brand name is a proper noun, untranslated).
- Any change to nav links, routes, or the CMS/backend.
