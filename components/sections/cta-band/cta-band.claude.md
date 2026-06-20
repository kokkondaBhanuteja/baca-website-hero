---
kind: 'component'
name: 'CtaBand'
file: 'components/sections/cta-band/cta-band.tsx'
exports:
  - 'CtaBand'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - '@/constants/routes'
  - '@/i18n/navigation'
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
- Two links: Route.Contact (saffron bg-saffron, hover bg-paper), Route.Products (outline border border-paper/35)
- Primary link: bg-saffron px-7 py-3.5 text-ink, hover:bg-paper text-transition, includes ArrowRight icon with hover translate-x
- Secondary link: border-paper/35 px-7 py-3.5 text-paper, hover:bg-paper/10

Dependencies:

- lucide-react: ArrowRight
- next-intl: getTranslations
- @/constants/routes
- @/i18n/navigation: Link
- @/components/ui/eyebrow
- @/components/ui/reveal
- @/components/ui/rich: richTags

i18n:
Namespace: 'ctaBand'. Keys: 'eyebrow', 'heading' (supports t.rich), 'body', 'ctaEnquire', 'ctaCatalogue'.

Accessibility:
Semantic h2. Links are proper <Link> tags with hrefs.

Notes:
The richTags allows translators to add saffron italic emphasis to the heading. The band has a forest (dark green) background with paper (light) text for high contrast.
