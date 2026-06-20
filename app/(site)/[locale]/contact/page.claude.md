---
kind: 'page'
name: 'ContactPage'
file: 'app/(site)/[locale]/contact/page.tsx'
exports:
  - 'generateMetadata'
  - 'ContactPage'
  - 'default'
imports_from:
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
Contact page with company details and enquiry form. Left side displays address, email, phone; right side has EnquiryForm (client component posting to POST /api/enquiry).

Data:

- next-intl: getTranslations('contactPage') — heading, eyebrow, intro, detailsTitle
- CONTACT constant — email, emailHref, phone, phoneDisplay, phoneHref
- SITE constant — address (array of lines)

Business Logic:

- setRequestLocale(locale as Locale)
- generateMetadata() fetches 'contactPage' namespace
- Renders two-column layout: left col (5 cols on lg), right col EnquiryForm (7 cols on lg)
- Contact links: mailto: and tel: hrefs

Renders:

- SiteHeader (forceSolid)
- PageIntro
- Contact details (email, phone, address)
- EnquiryForm (client component)
- SiteFooter

Notes:
EnquiryForm is a client component that submits to POST /api/enquiry (public endpoint). No locale parameter needed for constants (hardcoded).
