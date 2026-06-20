# Hero / Footer Wordmark Showpiece + Entry Motion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a giant `BACA` wordmark whose letterforms reveal looping Indian spice-heritage video (every.com-style), with an on-load entry animation where the nav is visible from the first frame (everyegg.com feel) — delivered as two A/B branches off `main` (showpiece in the hero vs. in the footer).

**Architecture:** One shared client primitive `WordmarkMedia` (SVG `viewBox` for responsiveness; an HTML `<video>` inside an SVG `<foreignObject>` clipped by an SVG `<text>` path; poster + reduced-motion/mobile fallbacks; IntersectionObserver play/pause). Branch A wraps the hero in a `HeroEntry` client component that runs a one-time GSAP mount timeline (nav first → content stagger). Branch B drops `WordmarkMedia` into the footer's existing `[data-reveal]` wrapper, reusing the in-repo `ScrollFX` scroll reveal.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4, GSAP 3.15 (+ ScrollTrigger, already registered in `components/ui/scroll-fx.tsx`), next-intl v4.

## Global Constraints

- TypeScript strict, **no `any`** (ESLint `@typescript-eslint/no-explicit-any: error`). Use a scoped `eslint-disable-next-line` with a reason only where genuinely unavoidable.
- Descriptive names; **no single-letter identifiers**, even loop vars.
- `pnpm lint` and `pnpm build` must stay green (`ignoreBuildErrors: false`) at the end of every task that changes code.
- Commit messages: **omit any `Co-Authored-By: Claude` trailer.**
- **Never `git push` without explicit user approval** — build the branches locally; ask before pushing each.
- Honor `prefers-reduced-motion` everywhere; never render a blank/black box (always a poster/gradient fallback).
- The wordmark is the brand proper noun — **not localized**.
- Both branches are cut from an up-to-date `main`. Do not commit feature code to `main`.

## File Structure

**Shared (both branches):**

- `components/ui/wordmark-media.tsx` — NEW. The video-in-letters primitive. Sole responsibility: render the masked wordmark + manage playback/fallback. No reveal/animation logic (callers own that).
- `public/videos/spice-heritage.mp4` — NEW asset. Looping Indian spice-heritage footage (Pexels/Coverr, free/commercial).
- `public/images/wordmark-poster.jpg` — NEW asset. Poster still (first paint / reduced-motion / mobile).

**Branch A — `feat/hero-wordmark-entry`:**

- `components/sections/hero-entry.tsx` — NEW client wrapper. Runs the one-time entry timeline (nav + staged children). Sole responsibility: entry choreography.
- `components/sections/hero.tsx` — MODIFY. Rebuild around `WordmarkMedia` + `HeroEntry`.

**Branch B — `feat/footer-wordmark-reveal`:**

- `components/layout/site-footer.tsx:129-139` — MODIFY. Swap the plain oversized `<span>{SITE.brand}</span>` for `WordmarkMedia` inside the existing `[data-reveal]` block.

> **Note on testing:** this repo has no unit-test harness, and the deliverable is visual. "Tests" here are: `pnpm typecheck`/`pnpm lint`/`pnpm build` (correctness + strict types) plus **Playwright screenshots against the local dev server** (visual verification). That is the honest verification path for this work; do not scaffold Jest.

---

## Phase 1 — Branch A: `feat/hero-wordmark-entry`

### Task A0: Branch + source assets

**Files:**

- Create: `public/videos/spice-heritage.mp4`, `public/images/wordmark-poster.jpg`

- [ ] **Step 1: Cut the branch from up-to-date main**

```bash
cd /Users/BackendIntern/Documents/baca-website-hero
git checkout main && git pull --ff-only
git checkout -b feat/hero-wordmark-entry
```

- [ ] **Step 2: Source a looping spice clip from Pexels (no ffmpeg available — pick a pre-sized file)**

Use the Playwright MCP to browse `https://www.pexels.com/search/videos/turmeric%20powder/` (also try `red chillies drying`, `spices`). Pick a clip that is: full-frame warm motion, slow, loopable. On its page choose a **HD (1280×720) or SD** download (keeps file small without transcoding). Save the downloaded `.mp4` to `public/videos/spice-heritage.mp4`.

Acceptance: file exists and is a reasonable web size.

```bash
ls -lh public/videos/spice-heritage.mp4   # expect roughly < 6 MB; prefer < 3 MB
```

If only a large file is available, pick the lowest offered resolution; note the size in the commit message.

- [ ] **Step 3: Poster still**

Without ffmpeg we cannot extract a frame. Download a matching warm spice **still** from Pexels Photos (same subject/tone) and save as `public/images/wordmark-poster.jpg`, OR as a stopgap copy an existing warm image:

```bash
# stopgap only if no suitable still is sourced:
cp public/images/hero-spice.jpg public/images/wordmark-poster.jpg
```

Acceptance: `ls public/images/wordmark-poster.jpg` succeeds.

- [ ] **Step 4: Commit assets**

```bash
git add public/videos/spice-heritage.mp4 public/images/wordmark-poster.jpg
git commit -m "feat(hero): add spice-heritage wordmark video + poster assets"
```

---

### Task A1: `WordmarkMedia` primitive

**Files:**

- Create: `components/ui/wordmark-media.tsx`

**Interfaces:**

- Produces: `WordmarkMedia({ text?: string, videoSources: WordmarkVideoSource[], posterSrc: string, className?: string })` and `interface WordmarkVideoSource { src: string; type: string }`.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useEffect, useId, useRef, useState } from 'react'

export interface WordmarkVideoSource {
  src: string
  type: string
}

interface WordmarkMediaProps {
  /** The word to render. Brand proper noun — not translated. */
  text?: string
  videoSources: WordmarkVideoSource[]
  posterSrc: string
  /** Sizing/spacing owned by the consumer. */
  className?: string
}

/**
 * A full-width wordmark whose letterforms reveal a looping video (every.com-style
 * "media inside text"). Responsive via an SVG viewBox; the HTML <video> lives in a
 * <foreignObject> clipped by an SVG <text> path.
 *
 * Fallbacks: the <video> shows its poster before/without playback. Under
 * prefers-reduced-motion or on small screens we do not autoplay, so the poster
 * still shows — never a blank box. Decorative → aria-hidden, with a visually
 * hidden real-text label for assistive tech. Off-screen → paused.
 */
export function WordmarkMedia({
  text = 'BACA',
  videoSources,
  posterSrc,
  className,
}: WordmarkMediaProps) {
  const rawId = useId()
  const clipId = `wordmark-clip-${rawId.replace(/[^a-zA-Z0-9-]/g, '')}`
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [lowMotion, setLowMotion] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const smallScreen = window.matchMedia('(max-width: 640px)').matches
    const isLow = reduceMotion || smallScreen
    setLowMotion(isLow)

    const video = videoRef.current
    if (!video) return

    if (isLow) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={className}>
      <span className="sr-only">{text}</span>
      <svg
        viewBox="0 0 1000 240"
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <text
              x="50%"
              y="188"
              textAnchor="middle"
              fontFamily="var(--font-heading)"
              fontSize="240"
              fontWeight="600"
              letterSpacing="-6"
            >
              {text}
            </text>
          </clipPath>
        </defs>
        <foreignObject
          x="0"
          y="0"
          width="1000"
          height="240"
          clipPath={`url(#${clipId})`}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={posterSrc}
            muted
            loop
            playsInline
            autoPlay={!lowMotion}
            preload="metadata"
          >
            {videoSources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        </foreignObject>
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck + lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: PASS, 0 errors. (If `no-explicit-any` ever trips, fix the type — do not blanket-disable.)

- [ ] **Step 3: Commit**

```bash
git add components/ui/wordmark-media.tsx
git commit -m "feat(ui): add WordmarkMedia (video-in-letters primitive)"
```

---

### Task A2: `HeroEntry` + rebuild the hero

**Files:**

- Create: `components/sections/hero-entry.tsx`
- Modify: `components/sections/hero.tsx`

**Interfaces:**

- Consumes: `WordmarkMedia` (Task A1).
- Produces: `HeroEntry({ children: React.ReactNode })`.

- [ ] **Step 1: Write `HeroEntry`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Plays the home ENTRY timeline once on mount:
 *   1. the site header (nav) slides down + fades in — visible from the first frame
 *   2. elements marked [data-hero-reveal] stagger up in source order
 * Honors prefers-reduced-motion (everything shown, no motion). Scoped to the hero,
 * so it only runs on the home route where the hero renders.
 */
export function HeroEntry({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const header = document.querySelector('header')
    const revealItems = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-hero-reveal]'),
    )

    if (reduce) {
      gsap.set(revealItems, { opacity: 1, y: 0 })
      return
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (header) {
        timeline.from(header, { yPercent: -100, opacity: 0, duration: 0.5 })
      }
      timeline.from(
        revealItems,
        { opacity: 0, y: 30, duration: 0.9, stagger: 0.12 },
        header ? '-=0.1' : 0,
      )
    })

    return () => context.revert()
  }, [])

  return <div ref={rootRef}>{children}</div>
}
```

- [ ] **Step 2: Rebuild `components/sections/hero.tsx`** (replace the whole file)

```tsx
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { Link } from '@/i18n/navigation'
import { Eyebrow } from '@/components/ui/eyebrow'
import { WordmarkMedia } from '@/components/ui/wordmark-media'
import { HeroEntry } from '@/components/sections/hero-entry'

const WORDMARK_VIDEO_SOURCES = [
  { src: '/videos/spice-heritage.mp4', type: 'video/mp4' },
]

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink to-[#1a120a]" />

      <HeroEntry>
        <div className="relative mx-auto flex w-full max-w-[1340px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <div data-hero-reveal className="mb-6">
            <Eyebrow className="text-paper/80">{t('eyebrow')}</Eyebrow>
          </div>

          {/* Showpiece: BACA rendered in spice */}
          <div data-hero-reveal className="mb-8">
            <WordmarkMedia
              text={SITE.brand}
              videoSources={WORDMARK_VIDEO_SOURCES}
              posterSrc="/images/wordmark-poster.jpg"
              className="w-full"
            />
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div
              data-hero-reveal
              className="col-span-12 max-w-md lg:col-span-7"
            >
              <p className="text-pretty text-[15px] leading-relaxed text-paper/85">
                {t('body')}
              </p>
            </div>
            <div
              data-hero-reveal
              className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-self-end"
            >
              <Link
                href={Route.Products}
                data-cursor="fill"
                className="group inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-clay hover:text-paper"
              >
                {t('ctaProducts')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href={Route.Contact}
                data-cursor="fill"
                className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                {t('ctaContact')}
              </Link>
            </div>
          </div>

          <div
            data-hero-reveal
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper/15 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper/65"
          >
            <span>{t('countries')}</span>
            <span className="text-paper/30" aria-hidden>
              /
            </span>
            <span>{t('certs')}</span>
          </div>
        </div>
      </HeroEntry>
    </section>
  )
}
```

- [ ] **Step 3: Build**

```bash
pnpm lint && pnpm build
```

Expected: PASS. (`hero` keys `imageAlt`/`standardLabel`/`scroll` simply go unused — that is not an error.)

- [ ] **Step 4: Visual check (Playwright vs. local dev)**

```bash
pnpm dev -- -p 4010   # run in background
```

With the Playwright MCP: navigate to `http://localhost:4010/`, screenshot. Verify: nav visible at top from first paint; the `BACA` wordmark shows the video through the letters; content sits below. **Tune** the SVG `<text>` `fontSize`/`y`/`letterSpacing` in `wordmark-media.tsx` if letters clip or overflow the viewBox, and re-screenshot.

- [ ] **Step 5: Commit**

```bash
git add components/sections/hero-entry.tsx components/sections/hero.tsx
git commit -m "feat(hero): wordmark showpiece + on-load entry animation"
```

---

### Task A3: Fallback + responsive verification

- [ ] **Step 1: Reduced-motion**

With Playwright, emulate reduced motion and reload `http://localhost:4010/`:

- Entry timeline is skipped (content visible immediately), and the wordmark shows the **poster** (no playback). Screenshot to confirm no blank box.

- [ ] **Step 2: Mobile**

Resize the Playwright viewport to 390×844, reload. Verify: nav present, wordmark legible (poster, not autoplaying), CTAs wrap cleanly, no horizontal overflow. Adjust `viewBox`/`fontSize` only if the wordmark is too small/large on mobile.

- [ ] **Step 3: Final gate + commit any tuning**

```bash
pnpm lint && pnpm build
git add -A && git commit -m "fix(hero): tune wordmark sizing + verify reduced-motion/mobile fallbacks"
```

- [ ] **Step 4: Push (ONLY after asking the user)**

Ask the user for the go-ahead, then:

```bash
git push -u origin feat/hero-wordmark-entry
```

---

## Phase 2 — Branch B: `feat/footer-wordmark-reveal`

### Task B0: Branch + bring over the shared primitive/assets

**Files:**

- Create (via checkout from Branch A): `components/ui/wordmark-media.tsx`, `public/videos/spice-heritage.mp4`, `public/images/wordmark-poster.jpg`

- [ ] **Step 1: Cut the branch from up-to-date main**

```bash
git checkout main && git pull --ff-only
git checkout -b feat/footer-wordmark-reveal
```

- [ ] **Step 2: Copy the primitive + assets from Branch A (identical files, no duplication of work)**

```bash
git checkout feat/hero-wordmark-entry -- \
  components/ui/wordmark-media.tsx \
  public/videos/spice-heritage.mp4 \
  public/images/wordmark-poster.jpg
```

- [ ] **Step 3: Build + commit**

```bash
pnpm lint && pnpm build
git add -A
git commit -m "feat(ui): add WordmarkMedia primitive + spice-heritage assets"
```

---

### Task B1: Wordmark in the footer

**Files:**

- Modify: `components/layout/site-footer.tsx` (the oversized-wordmark block, currently lines 129–139)

**Interfaces:**

- Consumes: `WordmarkMedia` (Task B0).

- [ ] **Step 1: Add the import** (top of `site-footer.tsx`, with the other component imports)

```tsx
import { WordmarkMedia } from '@/components/ui/wordmark-media'
```

- [ ] **Step 2: Add the constant** (module scope, after the imports)

```tsx
const FOOTER_WORDMARK_VIDEO_SOURCES = [
  { src: '/videos/spice-heritage.mp4', type: 'video/mp4' },
]
```

- [ ] **Step 3: Replace the oversized wordmark block**

Replace this existing block:

```tsx
{
  /* Oversized wordmark */
}
;<div data-reveal className="border-t border-paper/12 pt-8">
  <div className="flex items-end justify-between gap-6">
    <span className="font-heading text-[clamp(4rem,21vw,16rem)] font-medium leading-[0.78] tracking-[-0.04em] text-paper">
      {SITE.brand}
    </span>
    <span className="hidden whitespace-nowrap pb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-paper/45 sm:block">
      {SITE.sub} · Est. {SITE.founded}
    </span>
  </div>
</div>
```

with (the `[data-reveal]` wrapper stays, so `ScrollFX` still clip-reveals it on scroll-into-view):

```tsx
{
  /* Oversized wordmark — video showing through the letters */
}
;<div data-reveal className="border-t border-paper/12 pt-8">
  <WordmarkMedia
    text={SITE.brand}
    videoSources={FOOTER_WORDMARK_VIDEO_SOURCES}
    posterSrc="/images/wordmark-poster.jpg"
    className="w-full"
  />
  <p className="mt-2 text-end font-mono text-[0.62rem] uppercase tracking-[0.22em] text-paper/45">
    {SITE.sub} · Est. {SITE.founded}
  </p>
</div>
```

- [ ] **Step 4: Build**

```bash
pnpm lint && pnpm build
```

Expected: PASS.

- [ ] **Step 5: Visual check**

```bash
pnpm dev -- -p 4010   # background
```

With Playwright: navigate to `http://localhost:4010/`, scroll to the footer, screenshot. Verify: the giant `BACA` shows the video through the letters and clip-reveals as it enters view; the `Bharat Cargo · Est. 2009` sub-line sits correctly; no overflow.

- [ ] **Step 6: Reduced-motion + mobile**

Emulate reduced motion → footer wordmark shows the poster, still reveals (ScrollFX sets it visible under reduced motion). Resize to 390px → legible, no overflow. Screenshot both.

- [ ] **Step 7: Commit**

```bash
git add components/layout/site-footer.tsx
git commit -m "feat(footer): wordmark video reveal in the footer"
```

- [ ] **Step 8: Push (ONLY after asking the user)**

```bash
git push -u origin feat/footer-wordmark-reveal
```

---

## Self-Review

**Spec coverage:**

- Shared `WordmarkMedia` primitive (video-in-letters, SVG text clip, poster + reduced-motion/mobile fallback, off-screen pause) → Task A1. ✓
- Asset sourcing (Pexels/Coverr loop + poster) → Task A0. ✓ (no-ffmpeg reality handled by pre-sized download)
- Branch A hero entry choreography (nav-first → staged content) → Tasks A2/A3. ✓
- Nav-visible-on-entry, scoped to home (hero only) → `HeroEntry` targets the global `header`, runs only where the hero renders. ✓
- Branch B footer scroll-reveal showpiece → Tasks B0/B1, reusing existing `[data-reveal]`/`ScrollFX`. ✓
- A/B = two branches off `main`, each self-contained → Phases 1 & 2. ✓
- Verification (lint/build/screenshot, reduced-motion, mobile, no CLS) → A2.S3–4, A3, B1.S4–6. ✓
- a11y (decorative aria-hidden + sr-only real text; honor reduced-motion) → built into `WordmarkMedia`. ✓

**Refinement vs. spec:** the spec floated a `reveal: 'mount' | 'scroll'` prop on `WordmarkMedia`; dropped as YAGNI — reveal is owned by the caller (`HeroEntry` for the hero, the existing `[data-reveal]`/`ScrollFX` for the footer), so the primitive stays purely presentational. The optional saffron "sheen" is also dropped from v1 (rise+fade only) to reduce risk; it can be a follow-up.

**Placeholder scan:** none — all steps carry real code/commands.

**Type consistency:** `WordmarkVideoSource { src; type }` and the `WordmarkMedia` prop names (`text`, `videoSources`, `posterSrc`, `className`) are identical across A1, A2 (hero), and B1 (footer); the video-sources constant is the same shape in both consumers.

## Known risks (verify during execution, not blockers)

- **`<foreignObject>` + `<video>`**: well-supported in modern Chrome/Safari/Firefox but historically finicky in Safari. The screenshot steps are the gate; if Safari misbehaves, fall back to a CSS `mask-image` of an inline SVG text data-URI over the video (same visual, different masking mechanism).
- **Header `from` flash**: `timeline.from(header, …)` sets the start state in `useEffect` (post-paint), so a 1-frame flash is possible. If visible in the screenshot, switch `HeroEntry`'s effect to `useLayoutEffect` (guard for SSR) or pre-set the header hidden via `gsap.set` before the timeline.
- **Asset size**: with no ffmpeg, pick the smallest acceptable Pexels resolution; if the only option is large, note it and consider installing ffmpeg (`brew install ffmpeg`, with user OK) to transcode to a smaller `.mp4` + `.webm`.
