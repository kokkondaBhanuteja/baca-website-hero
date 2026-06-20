---
kind: 'component'
name: 'SiteHeaderMobileMenu'
file: 'components/layout/site-header/mobile-menu/mobile-menu.tsx'
exports:
  - 'SiteHeaderMobileMenu'
imports_from:
  - 'lucide-react'
  - 'next-intl'
  - '@/constants/routes'
  - '@/constants/site'
  - '@/i18n/navigation'
  - '@/components/ui/language-switcher'
  - '@/components/layout/site-header/nav-types'
---

# SiteHeaderMobileMenu

Purpose:
Full-screen mobile overlay menu (shown below lg): accordion nav, language switcher, contact CTA. Body scroll is locked while open.

Used In:

- SiteHeaderClient — rendered as a sibling (outside header) so backdrop-filter doesn't trap it

Props:

- navItems: NavItem[] — nav items with optional accordion children
- isOpen: boolean — whether to show the overlay
- onClose: () => void — callback to close

Business Logic:

- If !isOpen, returns null
- Fixed inset-0 z-[60] flex flex-col bg-ink text-paper
- Header row: wordmark + close button (X icon)
- Nav: flex-1 overflow-y-auto px-5 pb-10 pt-4
- Each nav item: if has children, renders as accordion button + conditional expanded list; otherwise plain link
- Accordion state: openAccordion useState, toggle on button click
- Plus icon rotates 45° when accordion opens
- All links onClick close the menu
- Footer: LanguageSwitcher (tone='paper') + Contact CTA link (full width, saffron bg)
- Dividers between items: divide-y divide-paper/10

Dependencies:

- React hooks: useState
- lucide-react: Plus, X
- next-intl: useTranslations
- @/constants/routes, @/constants/site
- @/i18n/navigation: Link
- @/components/ui/language-switcher

i18n:
Namespaces: 'common' (enquire), 'header' (aria.closeMenu).

Accessibility:
aria-label on close button. Semantic <nav><ul><li> structure. Links are proper semantic elements.

Notes:
The menu is rendered outside the header (sibling) to avoid being trapped by the header's backdrop-filter. It's a full-screen overlay with accordion nav and a footer CTA. The Plus icon rotation indicates accordion state.
