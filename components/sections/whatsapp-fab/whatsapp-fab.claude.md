---
kind: 'component'
name: 'WhatsAppFab'
file: 'components/sections/whatsapp-fab/whatsapp-fab.tsx'
exports:
  - 'WhatsAppFab'
imports_from:
  - 'next-intl/server'
  - '@/constants/contact'
  - '@/components/ui/whatsapp-icon'
---

# WhatsAppFab

Purpose:
Floating WhatsApp action button fixed in bottom-right corner, links to CONTACT.whatsappUrl.

Used In:

- Home page (app/(site)/[locale]/page.tsx)

Props:

- No props — server component

Business Logic:

- Fixed positioned: bottom-5 end-5 z-40
- Circle button: h-12 w-12 inline-flex items-center justify-center, border border-line, bg-paper text-forest
- Renders `<WhatsAppIcon />` from `@/components/ui/whatsapp-icon` (single source of truth for the brand glyph — lucide-react has no WhatsApp icon). No label (aria-label via translation).
- Opens CONTACT.whatsappUrl in new tab
- Hover: -translate-y-0.5 (slight lift effect), shadow-[0_12px_30px_-12px_rgba(20,24,26,0.5)]
- data-cursor='fill' target for the magnetic cursor

Dependencies:

- next-intl: getTranslations
- @/constants/contact — CONTACT.whatsappUrl
- @/components/ui/whatsapp-icon — WhatsAppIcon brand glyph

i18n:
Namespace: 'whatsapp', key 'ariaLabel'.

Accessibility:
aria-label for screen readers.

Notes:
Simple floating action button. The whatsappUrl is typically a deeplink like 'https://wa.me/phone' from CONTACT constants. The end-5 uses logical positioning (LTR: right, RTL: left).
