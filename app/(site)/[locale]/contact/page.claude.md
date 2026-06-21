---
kind: 'page'
name: 'ContactPage'
file: 'app/(site)/[locale]/contact/page.tsx'
exports:
  - 'generateMetadata'
  - 'ContactPage'
  - 'default'
imports_from:
  - 'next'
  - 'lucide-react'
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/constants/contact'
  - '@/constants/site'
  - '@/components/shared/page-intro'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
  - '@/components/ui/whatsapp-icon'
  - '@/components/sections/contact/enquiry-form'
  - '@/components/sections/contact/location-map'
route: '/[locale]/contact'
auth: 'Public'
---

# ContactPage

Route: `/[locale]/contact`  
Kind: page (Next.js route convention file)  
Rendering: Server (SSG)  
Auth: Public

Purpose:
Dedicated contact page. Top of the page renders the `LocationMap` (Google
Maps iframe pinned to `SITE.address`), followed by a unified two-column rounded
panel: left column holds PageIntro + contact-channel links (Email / Phone /
WhatsApp) + corporate address card; right column (cream background) holds the
shared `<EnquiryForm />` (same client component used by the global
`ContactStrip`). The page passes `hideContactStrip` to `SiteFooter` so the
global pre-footer strip is suppressed — otherwise the same form would appear
again just above the dark footer.

Data:

- next-intl: `getTranslations('contactPage')` — heading, eyebrow, subheading,
  channels.{email,phone,whatsapp,whatsappAction}, officeTitle, form.\*
- `CONTACT` constant — email, emailHref, phoneDisplay, phoneHref, whatsappUrl
- `SITE` constant — address (array of lines)

Business Logic:

- `setRequestLocale(locale as Locale)`.
- `generateMetadata()` reads the `contactPage` namespace for `<title>` +
  `<meta description>`.
- Channels array (key/icon/label/value/href) drives the link list. WhatsApp
  opens in a new tab (target=\_blank, rel=noopener noreferrer); email/phone use
  mailto: / tel: hrefs.
- Email/Phone icons come from lucide-react; WhatsApp uses the shared
  `WhatsAppIcon` primitive from `@/components/ui/whatsapp-icon` (lucide has no
  WhatsApp icon; the primitive is the single source of truth for the brand
  glyph, also used by `whatsapp-fab`).
- Layout: `LocationMap` first, then a single `rounded-3xl` panel with
  `lg:grid-cols-12`, `items-start` on mobile and `lg:items-stretch` so the
  cream form column fills the panel height. Left (`lg:col-span-5`, paper bg,
  right border on lg+) — PageIntro, hoverable channel rows, address card with
  MapPin; Right (`lg:col-span-7`, cream bg, `flex` so the EnquiryForm can
  `h-full w-full` and `mt-auto` its action row to the bottom) — EnquiryForm.
- Footer: `<SiteFooter hideContactStrip />` so the global pre-footer strip is
  skipped here only. Every other route renders `<SiteFooter />` (no prop),
  which keeps the global strip on.

Renders:

- `SiteHeader forceSolid` — the page sits on `bg-paper` so the header needs
  its solid treatment from the first frame.
- `<LocationMap />` — at the top of `<main>`.
- Unified panel: PageIntro + channel links + address card (left) | EnquiryForm
  (right) — below the map.
- `<SiteFooter hideContactStrip />` — dark footer only, no global strip.

Notes:

- The same `<EnquiryForm />` instance is used here AND by the global
  `ContactStrip` on every other page. One submit pipeline, one validation
  surface (zod), one 200-char message counter. Each mount has its own state.
- The WhatsApp brand glyph is now centralized in `components/ui/whatsapp-icon/`
  (single source of truth shared by this page and `whatsapp-fab`). The earlier
  inline `WhatsAppGlyph` function in this file was removed.
