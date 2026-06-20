---
kind: 'component'
name: 'SiteHeaderClient'
file: 'components/layout/site-header/site-header-client/site-header-client.tsx'
exports:
  - 'SiteHeaderClient'
imports_from:
  - 'lucide-react'
  - 'next-intl'
  - '@/constants/animations'
  - '@/constants/sections/nav'
  - '@/constants/routes'
  - '@/constants/site'
  - '@/i18n/navigation'
  - '@/components/ui/language-switcher'
  - '@/components/layout/site-header/desktop-nav'
  - '@/components/layout/site-header/mobile-menu'
  - '@/components/layout/site-header/nav-types'
---

# SiteHeaderClient

Purpose:
Header orchestrator: scroll state (transparent → solid), mobile overlay toggle, body-scroll lock, nav-item derivation (Products/Insights dropdowns from links).

Used In:

- Rendered by SiteHeader server component

Props:

- forceSolid?: boolean — if true, always show solid header (for inner pages)
- productLinks: NavLink[] — top 3 products from server
- insightLinks: NavLink[] — top 3 articles from server

Business Logic:

- useState: isScrolled, isMobileOpen
- scrolled = forceSolid || isScrolled
- onScroll listener (passive): setIsScrolled(window.scrollY > SCROLL_HEADER_THRESHOLD_PX)
- useEffect cleanup: document.body.style.overflow = isMobileOpen ? 'hidden' : '' (body scroll lock)
- Builds navItems array from NAV constant + conditional dropdown children for 'products' and 'insights'
- header: fixed inset-x-0 top-0 z-50, transition-colors, className changes based on scrolled state (solid bg-paper/95 border-b, or transparent bg-transparent)
- Left: Logo Link with text-paper (transparent) or text-ink (solid)
- Center: SiteHeaderDesktopNav (hidden below lg)
- Right: LanguageSwitcher (hidden below md) + Contact CTA (hidden below sm) + mobile hamburger button (hidden above lg)
- Mobile menu rendered as sibling of header (outside header) as SiteHeaderMobileMenu

Dependencies:

- React hooks: useEffect, useState
- lucide-react: Menu
- next-intl: useTranslations
- @/constants/animations — SCROLL_HEADER_THRESHOLD_PX
- @/constants/sections/nav — NAV array
- @/constants/routes, @/constants/site
- @/i18n/navigation: Link
- @/components/ui/language-switcher
- @/components/layout/site-header/desktop-nav, mobile-menu

i18n:
Namespaces: 'nav' (dynamic nav.items.{key}.label), 'common' (enquire, viewAllCategories), 'header' (aria.home, aria.openMenu, aria.closeMenu), 'blogsPage' (allArticles).

Accessibility:
aria-label on logo + menu buttons. Keyboard nav on dropdowns (inherited from Dropdown component).

Notes:
The header transitions from transparent (over hero) to solid (on scroll past threshold). forceSolid overrides this for inner pages (they start solid). Mobile menu is a full-screen overlay managed separately. Body scroll is locked when mobile menu is open.
