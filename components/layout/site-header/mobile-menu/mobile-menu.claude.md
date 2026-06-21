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
  - '@/components/ui/cta-link'
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
- Each nav item: if no children, plain `<Link>`. If has children, renders a
  **split row**: a navigable `<Link>` for the label (tapping it goes straight
  to the parent page, e.g. /products / /blogs / /profile) PLUS a separate
  plus-icon `<button>` for the accordion toggle (tapping it expands the
  submenu without dismissing the menu or navigating).
- Accordion state: `openAccordion` useState, toggled by the plus button only.
- Plus icon rotates 45° when accordion opens.
- All links call `onClose` so navigating dismisses the overlay.
- Footer: LanguageSwitcher (tone='paper') + Contact CTA — shared `CtaLink` (`size="block"`, full-width saffron)
- Dividers between items: divide-y divide-paper/10

Dependencies:

- React hooks: useState
- lucide-react: Plus, X
- next-intl: useTranslations
- @/constants/routes, @/constants/site
- @/i18n/navigation: Link (nav items)
- @/components/ui/cta-link: CtaLink (the full-width Enquire pill)
- @/components/ui/language-switcher

i18n:
Namespaces: 'common' (enquire), 'header' (aria.closeMenu).

Accessibility:
aria-label on close button. Semantic <nav><ul><li> structure. Links are proper semantic elements.

Notes:
The menu is rendered outside the header (sibling) to avoid being trapped by the header's backdrop-filter. It's a full-screen overlay with accordion nav and a footer CTA. The Plus icon rotation indicates accordion state.
