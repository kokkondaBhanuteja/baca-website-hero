---
kind: 'component'
name: 'SiteFooter'
file: 'components/layout/site-footer/site-footer.tsx'
exports:
  - 'SiteFooter'
imports_from:
  - 'gsap'
  - 'gsap/ScrollTrigger'
  - 'lucide-react'
  - 'next-intl'
  - '@/constants/site'
  - '@/components/layout/site-footer/footer-columns'
  - '@/components/layout/site-footer/footer-marquee'
  - '@/components/layout/site-footer/footer-wordmark'
---

# SiteFooter

Purpose:
Site-wide footer (every public page). Compact stack: tagline marquee → columns block (description + address + nav columns + cert column) → oversized BACA wordmark with ocean stills → single-row legal strip with back-to-top. The previous "LET'S TALK / huge email / Start enquiry" hero block was removed to halve the footer's vertical footprint — the email + phone are now inline inside the description's `<address>` block, and Contact remains reachable from the top nav and the Resources column.

Used In:

- Every public page (`app/(site)/[locale]/layout.tsx` and all inner pages).

Props:

- None — client component.

Business Logic:

- `useEffect` queries every `[data-footer-reveal]` element under the footer ref. Reduced-motion bails out before building the timeline.
- For each reveal, a GSAP `from` tween animates `yPercent 16 → 0`, `autoAlpha 0 → 1`, and `clipPath inset(0% 0% 100% 0%) → 0`, on a per-element `ScrollTrigger` with `start: 'top 90%'`. Cleanup uses `gsap.context().revert()`.
- The `FooterWordmark` is intentionally **not** in the reveal pass — it shows immediately so the page never flashes blank; the cross-fading ocean stills inside (driven by `WordmarkSlideshow`'s own intersection timeline) carry the entrance motion.
- Renders top-to-bottom: `FooterMarquee` (full-bleed tagline strip), `FooterColumns` (description + inline email/phone + 3 nav columns + cert column, padding tightened to `py-10 lg:py-12`), `FooterWordmark` (the attraction; top padding tightened to `pt-6`), single-row legal strip (`© {year} BACA · GST · IEC` on the left, `Back to top` button on the right; `mt-6 py-5` padding).
- Year computed in the component via `new Date().getFullYear()` — fine because this is `'use client'` and only ever renders in the browser.
- Back-to-top calls `window.scrollTo({ top: 0, behavior: 'smooth' })`.

Dependencies:

- React hooks: `useEffect`, `useRef`.
- `gsap` + `gsap/ScrollTrigger`.
- `lucide-react`: `ArrowUp`.
- `next-intl`: `useTranslations`.
- `@/constants/site`: `SITE` (brand, sub, gst, iec).
- `@/components/layout/site-footer/footer-marquee`, `footer-columns`, `footer-wordmark`.

i18n:
Namespace `footer`. Keys used here: `marqueeItems` (array via `t.raw`), `backToTop`. The earlier `talkLabel` / `startEnquiry` keys were dropped along with the big contact statement.

Accessibility:
Semantic `<footer>`, `<address>` in FooterColumns, `<nav>` per column with `aria-label`. Back-to-top is a real `<button>` with a visible focus ring (`focus-visible:outline-saffron`). Reduced motion fully honoured.

Notes:
Sub-components opt into the scroll animation by adding `[data-footer-reveal]` to a wrapping element — no prop wiring needed.
