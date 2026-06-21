---
kind: 'component'
name: 'CtaLink'
file: 'components/ui/cta-link/cta-link.tsx'
exports:
  - 'CtaLink'
  - 'ctaLinkVariants'
imports_from:
  - 'react'
  - 'lucide-react'
  - 'class-variance-authority'
  - '@/i18n/navigation'
  - '@/lib/utils'
---

# CtaLink

Purpose:
The single marketing CTA pill for the public site — a locale-aware `Link` styled as a
rounded-full saffron/outline pill. Public-site counterpart to the admin `Button` primitive
(which is `<button>`-based on the admin/shadcn token set); `CtaLink` uses marketing tokens
(saffron / ink / paper) and renders the i18n `Link` so internal hrefs get the locale prefix.

Used In:

- `components/sections/hero/hero.tsx` (Products solid + Contact outline)
- `components/sections/cta-band/cta-band.tsx` (dark surface, lg)
- `app/(site)/[locale]/not-found.tsx` (Home solid + Products outline)
- `components/layout/site-header/mobile-menu/mobile-menu.tsx` (block, full-width Enquire)

Props:

- `href` — typed by the i18n `Link` (use `Route` enum values); locale prefix applied automatically
- `variant`: `'solid'` (default, saffron fill) | `'outline'` (bordered)
- `tone`: `'light'` (default, over paper) | `'dark'` (over forest/ink) — drives hover + outline colour
- `size`: `'md'` (default, `px-6 py-3`) | `'lg'` (`px-7 py-3.5`) | `'block'` (full-width, `text-base`)
- `arrow`: boolean — render a trailing ArrowRight that nudges on hover (RTL-mirrored)
- `className` — merged via `cn` (tailwind-merge), so callers can override padding/colour
- `...props` — all other i18n `Link` props pass through (e.g. `onClick`, `data-cursor`)

Business Logic:

- `ctaLinkVariants` (cva) composes `variant × tone × size`; solid/outline hover colours come from
  `compoundVariants` (solid+light → `hover:bg-clay hover:text-paper`; solid+dark → `hover:bg-paper`;
  outline+light → `hover:bg-ink hover:text-paper`; outline+dark → `hover:bg-paper/10`).
- Sets `data-cursor="fill"` by default so the global magnetic Cursor wraps/fills it; overridable.
- The arrow uses `group-hover:translate-x-1` plus `rtl:-scale-x-100 rtl:group-hover:-translate-x-1`
  so it points and nudges correctly under Arabic RTL.

Dependencies:

- `@/i18n/navigation`: `Link` (locale-aware navigation — the only sanctioned internal link)
- `class-variance-authority`: cva variant composition (same pattern as `button`)
- `@/lib/utils`: `cn()` for class merging
- `lucide-react`: `ArrowRight`

i18n:
None — label comes via children; the caller resolves translations. `href` is locale-prefixed by `Link`.

Accessibility:
Renders a semantic anchor with a visible label. The decorative arrow is `aria-hidden`.
Works in both Server and Client Components (no hooks, no `'use client'`).

Notes:
This replaced four hand-rolled copies of the saffron/outline pill. Prefer `CtaLink` for any public
marketing call-to-action; do NOT reach for `components/ui/button` (admin token set, `<button>`).
