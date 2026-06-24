---
kind: 'component'
name: 'SiteFooter'
file: 'components/layout/site-footer/site-footer.tsx'
exports:
  - 'SiteFooter'
imports_from:
  - 'lucide-react'
  - 'next-intl'
  - '@/constants/site'
  - '@/constants/contact'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/components/sections/contact/contact-strip'
---

# SiteFooter

Purpose:
Site-wide footer rendered on every public page. Stacks: the global
`ContactStrip` (pre-footer enquiry section) → four-column nav block on a
dark `bg-ink` ground → single-row legal strip with a back-to-top button →
oversized BACA wordmark.

Used In:

- Every public page (`app/(site)/[locale]/layout.tsx` and all inner pages).

Props:

- `hideContactStrip?: boolean` (default `false`) — when `true`, the global
  `<ContactStrip />` rendered above the `<footer>` element is suppressed.
  `/contact` passes this because it already shows the full enquiry panel above
  and would otherwise display a duplicate form.

Business Logic:

- Defines a local `cols` array (typed as `Col[]`) in the component body, built
  from i18n keys + the `Route`/`CONTACT`/`CERT_MARKS` constants. Four columns:
  Products, Company, Reach Us, Certified.
- Items use `isLink: true` for `<Link>` rendering (locale-aware `i18n/navigation`)
  and `isLink: false` for plain `<span>` rendering (cert marks).
- Year computed inline via `new Date().getFullYear()` — safe because this is
  `'use client'` and renders only in the browser.
- Back-to-top is a real `<button>` that calls
  `window.scrollTo({ top: 0, behavior: 'smooth' })`.

Dependencies:

- `lucide-react`: `ArrowUp`.
- `next-intl`: `useTranslations`.
- `@/constants/site`: `SITE` (brand, gst, iec), `CERT_MARKS`.
- `@/constants/contact`: `CONTACT` (email, phone display, WhatsApp URL).
- `@/constants/routes`: `Route` enum.
- `@/i18n/navigation`: locale-aware `Link`.
- `@/components/sections/contact/contact-strip`: rendered as a fragment sibling
  above the `<footer>` element when `hideContactStrip` is unset.

i18n:
Namespace `footer`. Keys used: `columns.products.{title,links.{all,spices,nutsSeeds,gallery}}`,
`columns.company.{title,links.{about,insights,contact}}`,
`columns.reach.{title,links.whatsapp}`, `columns.certified.{title,spicesBoard}`,
and `backToTop`. Email / phone display values come from
`@/constants/contact` since they are not localized.

Accessibility:
Semantic `<footer>` landmark. Back-to-top is a `<button type="button">`.
Locale-aware `<Link>` elements (the i18n navigation helper) handle nav.

Notes:
This is the current flat single-file implementation. Earlier revisions split
the footer into `FooterMarquee` / `FooterColumns` / `FooterWordmark` /
`FooterLink` sub-components driven by a `FOOTER_COLUMNS` constant — those have
been removed since they were unused. If you want to re-introduce per-row
animation, add `[data-footer-reveal]` attributes and wire up a GSAP timeline
in this file.
