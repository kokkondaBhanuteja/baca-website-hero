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
Rendering: Server (ISR — `revalidate = 3600`)  
Auth: Public

Purpose:
Marketing homepage. Composed of multiple hero and content sections (Hero, Manifesto, Stats, ProductPreview, Approach, Certifications, GlobalPresence, PullQuote, FeaturedInsights, CTA). WhatsAppFab is rendered in the locale layout.

Data:

- ProductPreview → `getCategoriesForLocale` (tagged `CATEGORIES_TAG`)
- FeaturedInsights → `listPublishedArticles` (tagged `BLOG_ARTICLES_TAG`)
- SiteHeader nav dropdowns → `listPublishedProducts` / `listPublishedArticles` (tagged `PRODUCTS_TAG`, `BLOG_ARTICLES_TAG`)

Business Logic:

- `export const revalidate = 3600` — ISR fallback; admin mutations also call `revalidateTag(…, 'max')` in services so DB slices refresh on the next request
- setRequestLocale(locale as Locale) enables static rendering per locale
- SiteHeader rendered with `lightHero` — the Hero is a light pale-sage field, so the header rides transparent with DARK text over it and its background turns solid-white only on scroll.
- ScrollFX component (scroll animations on mount)

Renders:

- SiteHeader (lightHero — transparent + dark text over hero → solid-white on scroll)
- Hero (full-bleed pale-sage `bg-mist`, GMCT-structured giant headline in `text-pine`)
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
