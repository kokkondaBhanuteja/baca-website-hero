---
kind: 'page'
name: 'ContactPage'
file: 'app/(site)/[locale]/contact/page.tsx'
exports:
  - 'generateMetadata'
  - 'ContactPage'
  - 'default'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/constants/contact'
  - '@/constants/site'
  - '@/components/shared/page-intro'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
  - '@/components/sections/contact/enquiry-form'
route: '/[locale]/contact'
auth: 'Public'
---

# ContactPage

Route: `/[locale]/contact`  
Kind: page (Next.js route convention file)  
Rendering: Server (SSG)  
Auth: Public

Purpose:
Two-column contact page: left column holds the PageIntro + three contact-channel cards (Email / Phone / WhatsApp) + office address; right column holds the `EnquiryForm` (client component posting to `POST /api/enquiry`).

Data:

- next-intl: getTranslations('contactPage') — heading, eyebrow, intro, channels.{email,phone,whatsapp,whatsappAction}, officeTitle, form.\*
- CONTACT constant — email, emailHref, phoneDisplay, phoneHref, whatsappUrl
- SITE constant — address (array of lines)

Business Logic:

- `setRequestLocale(locale as Locale)`.
- `generateMetadata()` fetches the `contactPage` namespace.
- Channels array (key/icon/label/value/href) drives the card list. WhatsApp opens in a new tab (target=\_blank, rel=noopener noreferrer); email/phone use mailto:/tel: hrefs.
- Layout: `lg:grid-cols-12 lg:gap-16`. Left (`lg:col-span-5`) — PageIntro, channel cards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-1`), office block; Right (`lg:col-span-7`) — EnquiryForm.

Renders:

- SiteHeader (forceSolid).
- PageIntro + channel cards + office address (left).
- EnquiryForm — client component, public POST to /api/enquiry (right).
- SiteFooter.

Notes:
The page is SSG except for the EnquiryForm sub-tree, which is a client island that handles its own state and POST. CONTACT/SITE values are constants (not translated). Channel-card layout collapses to single column on mobile and stacks vertically on `lg+` to match the narrow left column.
