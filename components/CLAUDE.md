# components/

```
ui/          Presentational primitives, zero page copy. Reusable everywhere.
layout/      Site chrome: site-header (+ site-header-client), site-footer.
sections/    Home/page sections (hero, manifesto, product-preview, approach, certifications,
             featured-insights, cta-band, …). Grouped by area where useful (sections/contact/).
shared/      Cross-page reusables (page-intro = inner-page header).
```

(Admin-only components live with the admin app at `app/(admin)/admin/components/`, not here.)

## Key reusable primitives (ui/) — prefer these, don't reinvent

- **`CtaLink`** — the marketing CTA pill (saffron/outline rounded-full, rendered as the i18n `Link`).
  **Use this for any public call-to-action** instead of hand-rolling the pill classes. Props:
  `href, variant: 'solid'|'outline', tone: 'light'|'dark', size: 'md'|'lg'|'block', arrow`.
  (Distinct from `Button`, which is the admin/`<button>` primitive on the shadcn token set.)
- **`Dropdown`** — the custom select. **Use this instead of a native `<select>` anywhere.**
  Props: `value, options: {value,label}[], onChange, buttonClassName, menuAlign, disabled, ariaLabel`.
  Closes on outside-click/Escape. Used by `language-switcher` and all admin form selects.
- **`MediaReveal`** — wrap an image container for a GSAP clip-path + fade scroll reveal (flash-free: hidden
  state is inline, revealed on scroll; reduced-motion shows immediately). Use for all content images.
- **`Eyebrow`** — the saffron-rule + mono label used above headings.
- **`Reveal`** / **`RevealImage`** — IntersectionObserver / GSAP reveals for the static home sections.
- **`ScrollFX`** — home-only `[data-reveal]`/`[data-parallax]` GSAP driver (mounted in `page.tsx`).
- **`LanguageSwitcher`** — locale picker built on `Dropdown`; `router.replace(pathname, { locale })`.

## Patterns

- **Server vs client**: sections that only render translated text are `async` Server Components
  (`await getTranslations(ns)`); interactive ones (`'use client'`) use `useTranslations`. The header is split:
  `site-header.tsx` (server, fetches top-3 products/insights for the nav dropdowns) → `site-header-client.tsx`
  (client, scroll state + dropdowns + mobile menu). Inner pages pass `<SiteHeader forceSolid />` (solid over light bg).
- **DB-driven sections** (`product-preview`, `featured-insights`) fetch via `lib/server/services/*` using
  `await getLocale()`; they render whatever is published (e.g. one category) — keep them count-agnostic.
- **Dynamic next-intl keys** cast as `t(\`items.${key}\` as Parameters<typeof t>[0])`.
- Direction-sensitive styling uses Tailwind **logical** utilities (`ps/pe`, `ms/me`, `start/end`, `text-start`)
  so Arabic RTL mirrors automatically.
