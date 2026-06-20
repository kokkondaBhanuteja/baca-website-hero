---
kind: 'layout'
name: 'SiteRootLayout'
file: 'app/(site)/[locale]/layout.tsx'
exports:
  - 'generateStaticParams'
  - 'generateMetadata'
  - 'viewport'
  - 'LocaleLayout'
  - 'default'
imports_from:
  - '@vercel/analytics/next'
  - 'next-intl'
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/i18n/routing'
  - '@/components/ui/cursor'
---

# SiteRootLayout

Route: `n/a`  
Kind: layout (Next.js route convention file)  
Rendering: Server (SSG)  
Auth: n/a

Purpose:
Root HTML document for the public site. Sets up localization via NextIntlClientProvider, loads 4 fonts (Inter, Fraunces, JetBrains Mono, Noto Sans Arabic), applies CSS variables, and renders the global Cursor component. generateStaticParams generates routes for all 7 locales.

Data:

- _No external data sources_

Business Logic:

- generateStaticParams() maps routing.locales to static params
- generateMetadata() calls getTranslations('metadata', locale) to fetch title + description per locale
- setRequestLocale(locale) enables static rendering for the route
- hasLocale() validates locale; notFound() if invalid
- LOCALE_META[locale] provides text direction (dir attribute)
- Vercel Analytics included only in production
- NextIntlClientProvider wraps children (client-side i18n context)
- HTML lang and dir set dynamically per locale

Renders:

- Cursor (global magnetic cursor)
- NextIntlClientProvider (client provider)
- children (locale-specific routes)

Notes:
This is the second root layout (sibling to admin layout). No shared app/layout.tsx exists; route groups enable two independent document roots. Fonts are CSS variables (--font-inter, --font-fraunces, --font-jetbrains-mono, --font-arabic) to support RTL locales.
