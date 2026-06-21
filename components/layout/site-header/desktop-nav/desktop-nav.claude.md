---
kind: 'component'
name: 'SiteHeaderDesktopNav'
file: 'components/layout/site-header/desktop-nav/desktop-nav.tsx'
exports:
  - 'SiteHeaderDesktopNav'
imports_from:
  - 'react'
  - 'lucide-react'
  - 'next-intl'
  - '@/i18n/navigation'
  - '@/components/layout/site-header/nav-types'
---

# SiteHeaderDesktopNav

Purpose:
Desktop nav row (hidden below `lg`). Renders one of two shapes per item:

- **Without children** — single `<Link>` that navigates to `item.href`.
- **With children** — a "split" parent: a navigable `<Link>` for the label
  (clicking goes to the parent page, e.g. /products) PLUS a small chevron
  `<button>` next to it that opens the dropdown submenu. Mouse-hover on the
  wrapper also opens the submenu (existing convenience for desktop users);
  the chevron button exists so touch and keyboard users have a reliable trigger.

Used In:

- `SiteHeaderClient` — rendered in the center slot on `lg+` only.

Props:

- `navItems: NavItem[]` — array of nav items with optional `children`.
- `scrolled: boolean` — true when the header is in its solid state; controls
  text-color tokens (`text-ink/*` solid, `text-paper/*` over-hero).

Business Logic:

- `useState<string | null> openKey` tracks which submenu is open (one at a time).
- Hover on the wrapper `<div>` opens the matching submenu via `setOpenKey(item.key)`;
  `onMouseLeave` closes.
- Click outside the nav closes (`mousedown` listener on document).
- `Escape` closes + returns focus to the chevron trigger via `triggerRefs`.
- Chevron `onKeyDown` opens on `ArrowDown` / `Enter` / `Space` (keyboard
  fallback); the label `<Link>` handles `Enter` for navigation natively.
- Each chevron carries `aria-haspopup="menu"`, `aria-expanded`,
  `aria-controls={panelId}`, and an `aria-label` like `"Products submenu"`
  so screen readers distinguish it from the label link sitting next to it.
- Submenu panel: absolutely positioned `start-0 top-full`, fade + translate
  in/out, `<ul role="menu">` of `<Link role="menuitem">` items.

Dependencies:

- React hooks: `useCallback`, `useEffect`, `useId`, `useRef`, `useState`, `KeyboardEvent` type.
- `lucide-react`: `ChevronDown`.
- `next-intl`: `useTranslations` (for the `<nav aria-label>`).
- `@/i18n/navigation`: `Link` (locale-aware).
- `nav-types`: `NavItem`.

i18n:
None for visible content (text comes via props from `SiteHeaderClient`).
Pulls `header.aria.primaryNav` for the `<nav>` landmark label.

Accessibility:
Parent labels are real `<Link>`s — Cmd-click opens in a new tab, Enter
navigates. Chevron disclosure follows the WAI-ARIA disclosure pattern.
Submenu items use `role="menuitem"` and `tabIndex={isOpen ? 0 : -1}` so
focus skips closed submenus.

Notes:
The split label+chevron pattern was introduced because the old single
`<button>` parent could only open the dropdown — clicking "Products" never
navigated to `/products`, which was unexpected. Now the label is a Link
again. Bonus: hover-open still works for mouse users; touch and keyboard
users get the explicit chevron trigger.
