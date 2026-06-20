---
kind: 'error'
name: 'SiteErrorBoundary'
file: 'app/(site)/[locale]/error.tsx'
exports:
  - 'SiteError'
imports_from:
  - 'next-intl'
  - '@/constants/routes'
  - '@/i18n/navigation'
---

# SiteErrorBoundary

Route: `n/a`  
Kind: error (Next.js route convention file)  
Rendering: Client  
Auth: n/a

Purpose:
Site-wide error boundary. Renders a self-contained error screen without SiteHeader (header fetches DB data that may have failed). Provides retry and home navigation options.

Data:

- next-intl: getTranslations('errors') — translations for eyebrow, title, body, retry, home keys

Business Logic:

- useEffect logs error to console
- Renders standalone UI without SiteHeader/SiteFooter
- onClick reset calls React error boundary reset
- Retry button allows re-rendering the failed component
- Home link navigates to Route.Home (i18n-aware Link)

Renders:

- Error text and message from 'errors' translations
- Retry button
- Home link

Notes:
Client component. Uses 'use client'. Catches errors bubbled from server/client children. No header rendered to avoid compounding errors.
