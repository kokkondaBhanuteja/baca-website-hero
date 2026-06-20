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

- Grid layout: gap-x-8 gap-y-12 py-16 lg:grid-cols-12
- Left col (lg:col-span-5): description text + address (not-italic, <br> line breaks)
- Nav columns via FOOTER_COLUMNS constant: each col lg:col-span-2, ul flex flex-col gap-3
- Each col: h3 (title), ul of FooterLink children
- Right col (lg:col-span-1): certifications strip (h3 + list of cert marks)
- All sections have data-footer-reveal attribute (to participate in parent's GSAP animation)

Dependencies:

- next-intl: useTranslations
- @/constants/contact, @/constants/site — SITE.address, CONTACT.phoneHref, CONTACT.phoneDisplay
- @/constants/sections/footer — FOOTER_COLUMNS array
- @/components/layout/site-footer/footer-link

i18n:
Namespace: 'footer'. Keys: 'description', 'columns.{col.key}.title', 'columns.{col.key}.links.{link.key}', 'certifiedTitle'.

Accessibility:
Semantic <address> tag. Links are semantic <a> tags (wrapped in FooterLink). h3 headers per column.

Notes:
Address uses <br> tags (not semantic, but legible). Phone link wraps CONTACT.phoneHref + CONTACT.phoneDisplay constants. Must be rendered inside a next-intl provider since it calls useTranslations.
