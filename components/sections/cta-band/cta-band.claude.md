---
kind: 'component'
name: 'CtaBand'
file: 'components/sections/cta-band/cta-band.tsx'
exports:
  - 'CtaBand'
imports_from:
  - 'next-intl/server'
  - '@/constants/routes'
  - '@/components/ui/cta-link'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
  - '@/components/ui/rich'
---

# CtaBand

Purpose:
Full-width dark forest call-to-action band: eyebrow + headline + body + two CTAs (primary saffron + secondary outline).

Used In:

- Home page — appears just before the footer

Props:

- No props — server component

Business Logic:

- Single Reveal wrapper around the entire section
- t.rich('heading', richTags) renders the headline with saffron italic <em> spans
- Two shared `CtaLink` pills on the dark surface (`tone="dark" size="lg"`): Route.Contact (solid, `arrow`)
  and Route.Products (`variant="outline"`)

Dependencies:

- next-intl: getTranslations
- @/constants/routes
- @/components/ui/cta-link: CtaLink (shared marketing CTA pill — `tone="dark"` for this forest band)
- @/components/ui/eyebrow
- @/components/ui/reveal
- @/components/ui/rich: richTags

i18n:
Namespace: 'ctaBand'. Keys: 'eyebrow', 'heading' (supports t.rich), 'body', 'ctaEnquire', 'ctaCatalogue'.

Accessibility:
Semantic h2. Links are proper <Link> tags with hrefs.

Notes:
The richTags allows translators to add saffron italic emphasis to the heading. The band has a forest (dark green) background with paper (light) text for high contrast.
