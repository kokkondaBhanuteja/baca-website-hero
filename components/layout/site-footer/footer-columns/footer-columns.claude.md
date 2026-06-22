---
kind: 'component'
name: 'FooterColumns'
file: 'components/layout/site-footer/footer-columns/footer-columns.tsx'
exports:
  - 'FooterColumns'
imports_from:
  - 'next-intl'
  - '@/constants/contact'
  - '@/constants/site'
  - '@/constants/sections/footer'
  - '@/components/layout/site-footer/footer-link'
---

# FooterColumns

Purpose:
Middle body of the footer. Renders a display-sized "BACA" brand mark at the
top of the brand column (`SITE.brand` + a tiny saffron square accent, the
modern-footer "brand signature" treatment), followed by the brand description,
address, and email/phone. Three nav columns (Products / Company / Resources)
sit on the right at `lg:col-span-2` each (total 6 of 12).

An earlier revision opened with a display-type "Sourced from Indian soil…"
tagline above the grid and closed with a `CERT_MARKS` certifications pill
row below it; both were removed at the user's request. `CERT_MARKS` is still
defined in `@/constants/site` and used by the home page's
`components/sections/certifications/` block.

Used In:

- `SiteFooter` — rendered between `FooterMarquee` (above) and the legal row.

Props:

- No props — server-rendered (but actually transitively a client component
  because `SiteFooter` is `'use client'` and this is its child). Calls
  `useTranslations`, so it must sit inside the next-intl provider.

Business Logic:

- `grid gap-x-8 gap-y-10 lg:grid-cols-12 lg:gap-x-10`. Brand block opens with
  a display-sized wordmark in the heading face — `text-[clamp(3.5rem,7vw,5.5rem)]
font-light leading-none tracking-[-0.03em] text-paper`, just the brand name
  on its own (no accent mark). Description text follows with `mt-6` for
  breathing room under the now-tall wordmark.
  Then the description + a real `<address>` (two address lines split by
  `<br />` instead of the old inline `·`) + a compact email/phone row that
  collapses to two stacked lines on mobile and inlines with a `·` separator
  on `sm+`. Nav columns iterate `FOOTER_COLUMNS`.
- The brand wordmark reads `SITE.brand` — single source of truth in
  `constants/site.ts`. If the brand ever rebrands, edit that constant.
- Every section carries `data-footer-reveal` so the parent's GSAP stagger
  picks it up.

Dependencies:

- next-intl: useTranslations
- @/constants/contact — `CONTACT.email`/`emailHref`/`phoneDisplay`/`phoneHref`
- @/constants/site — `SITE.address`, `CERT_MARKS`
- @/constants/sections/footer — `FOOTER_COLUMNS` array
- @/components/layout/site-footer/footer-link — `FooterLink` primitive

i18n:
Namespace: `footer`. Keys: `description` (short one-liner about BACA),
`columns.{col.key}.title`, `columns.{col.key}.links.{link.key}`. (The earlier
`tagline` and `certifiedTitle` keys were removed along with the display line
and the certifications pill row.)

Accessibility:

- Address uses a semantic `<address>` element.
- Nav columns are `<nav aria-label={title}>` containers with `<h3>` headings.
- Certifications are a `<ul>` of `<li>` pills; the `·` separator in the email/
  phone row is `aria-hidden` because it's a decorative bullet.

Notes:

- The `tagline` translation key was added across all 7 locales when this
  redesign landed. Future copy edits should keep the tagline ≤ 6 words for
  the display sizing to hold on narrower viewports.
- If the brand ever ships a logo mark again, replace the tagline `<p>` with a
  brand `<svg>` and keep the section's `max-w-*` constraint.
