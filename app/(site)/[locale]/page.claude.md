---
kind: 'page'
name: 'HomePage'
file: 'app/(site)/[locale]/page.tsx'
exports:
  - 'Page'
  - 'default'
imports_from:
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/components/ui/scroll-fx'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
  - '@/components/sections/hero'
  - '@/components/sections/manifesto'
  - '@/components/sections/stats-row'
  - '@/components/sections/product-preview'
  - '@/components/sections/approach'
  - '@/components/sections/certifications'
  - '@/components/sections/global-presence'
  - '@/components/sections/pull-quote'
  - '@/components/sections/featured-insights'
  - '@/components/sections/cta-band'
  - '@/components/sections/whatsapp-fab'
route: '/[locale]'
auth: 'Public'
---

# HomePage

Route: `/[locale]`  
Kind: page (Next.js route convention file)  
Rendering: Server (SSG)  
Auth: Public

Purpose:
Marketing homepage. Composed of multiple hero and content sections (Hero, Manifesto, Stats, ProductPreview, Approach, Certifications, GlobalPresence, PullQuote, FeaturedInsights, CTA, WhatsApp FAB). Static rendered per locale.

Data:

- _No external data sources_

Business Logic:

- setRequestLocale(locale as Locale) enables static rendering
- SiteHeader rendered with forceSolid=true (always opaque)
- ScrollFX component (scroll animations on mount)

Renders:

- SiteHeader (forceSolid)
- Hero
- Manifesto
- StatsRow
- ProductPreview
- Approach
- Certifications
- GlobalPresence
- PullQuote
- FeaturedInsights
- CtaBand
- SiteFooter
- WhatsAppFab

Notes:
No params passed to sections; they use getLocale() internally to fetch translations/data. ScrollFX runs once on page load.
