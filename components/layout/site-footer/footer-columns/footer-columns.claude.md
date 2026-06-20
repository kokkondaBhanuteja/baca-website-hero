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
Middle grid of footer: description + address block, localized nav columns, certifications strip. Opts into parent's [data-footer-reveal] animation.

Used In:

- SiteFooter — rendered after marquee

Props:

- No props — client component (calls useTranslations)

Business Logic:

- Grid layout: `gap-x-8 gap-y-10 py-10 lg:grid-cols-12 lg:py-12` (tightened from the previous `py-16 gap-y-12` to halve the block height).
- Left col (`lg:col-span-5`): description text + compact `<address>` block. Address now puts the two street lines on one row separated by `·`, then the email + phone on a single line below — replaces the previous 3-row stacked address. Inline mailto + tel links use a hover transition to `text-paper`.
- Nav columns via `FOOTER_COLUMNS` constant: each `lg:col-span-2`, `ul` is `flex flex-col gap-3`.
- Each col: `h3` (title) + `ul` of FooterLink children.
- Right col (`lg:col-span-1`): certifications strip (`h3` + list of cert marks).
- Every section has `data-footer-reveal` so the parent's GSAP stagger picks it up.

Dependencies:

- next-intl: useTranslations
- @/constants/contact, @/constants/site — SITE.address, CONTACT.email/emailHref/phoneHref/phoneDisplay
- @/constants/sections/footer — FOOTER_COLUMNS array
- @/components/layout/site-footer/footer-link

i18n:
Namespace: 'footer'. Keys: 'description', 'columns.{col.key}.title', 'columns.{col.key}.links.{link.key}', 'certifiedTitle'.

Accessibility:
Semantic <address> tag. Links are semantic <a> tags (wrapped in FooterLink). h3 headers per column.

Notes:
Address uses <br> tags (not semantic, but legible). Phone link wraps CONTACT.phoneHref + CONTACT.phoneDisplay constants. Must be rendered inside a next-intl provider since it calls useTranslations.
