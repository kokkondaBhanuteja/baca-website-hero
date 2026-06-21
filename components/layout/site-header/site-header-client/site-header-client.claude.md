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
- Builds navItems array from NAV constant + conditional dropdown children:
  - `products` → DB-driven (top 3 products + "View all" entry)
  - `insights` → DB-driven (top 3 blog types)
  - `profile` → static (5 section anchors on /profile, labels reuse each section's `profilePage.<section>.eyebrow` translation so there's zero duplicate copy to maintain)
- header: fixed inset-x-0 top-0 z-50, transition-colors, className changes based on scrolled state (solid bg-paper/95 border-b, or transparent bg-transparent)
- Inner container is **flex `justify-between`** below `lg` (guarantees the wordmark on the far left + hamburger on the far right on mobile) and switches to a **3-column grid `[1fr_auto_1fr]`** on `lg+` so the desktop nav sits at true page centre regardless of the wordmark's vs the right-actions' widths. Logo gets `lg:justify-self-start`, right actions get `lg:justify-self-end` (no-ops on mobile flex).
- Wordmark: BACA in font-heading, `text-3xl` on mobile for presence, `sm:text-2xl` from sm+. Colour swaps text-paper (transparent) ↔ text-ink (solid). The previous "Bharat Cargo" sub-line was removed when `SITE.sub` was dropped.
- Middle slot: SiteHeaderDesktopNav (hidden below lg — `display:none` on mobile so the flex skips it).
- Right slot: LanguageSwitcher (hidden below md) + Contact CTA (hidden below sm) + mobile hamburger button (hidden above lg).
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
Namespaces: `nav` (dynamic `nav.items.{key}.label`), `common` (enquire,
viewAllCategories), `header` (aria.home, aria.openMenu, aria.closeMenu),
`profilePage` (each section's `eyebrow` — drives the Profile dropdown labels).

Accessibility:
aria-label on logo + menu buttons. Keyboard nav on dropdowns (inherited from Dropdown component).

Notes:
The header transitions from transparent (over hero) to solid (on scroll past threshold). forceSolid overrides this for inner pages (they start solid). Mobile menu is a full-screen overlay managed separately. Body scroll is locked when mobile menu is open.
