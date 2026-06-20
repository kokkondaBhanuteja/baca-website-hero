---
kind: 'component'
name: 'SiteHeaderDesktopNav'
file: 'components/layout/site-header/desktop-nav/desktop-nav.tsx'
exports:
  - 'SiteHeaderDesktopNav'
imports_from:
  - 'lucide-react'
  - '@/i18n/navigation'
  - '@/components/layout/site-header/nav-types'
---

# SiteHeaderDesktopNav

Purpose:
Desktop nav row (hidden below lg): plain text links with optional hover dropdowns for Products/Insights.

Used In:

- SiteHeaderClient — rendered in the center of the header on desktop only

Props:

- navItems: NavItem[] — array of nav items with optional children
- scrolled: boolean — true if header is solid (text color differs)

Business Logic:

- nav hidden lg: flex gap-1
- Each item: group relative div containing a Link + optional hidden dropdown
- Link: text-sm text-paper/85 (transparent) or text-ink/80 (solid), hover text-paper/text-ink, flex items-center gap-1
- Dropdown (if children): absolutely positioned (start-0 top-full), invisible → visible on group-hover, min-w-60, mt-2 pt-2, rounded-2xl border-line bg-paper shadow
- Dropdown items: Link px-3 py-2 text-ink/75, hover:bg-bone, rounded-xl
- ChevronDown icon rotates 180° on hover

Dependencies:

- lucide-react: ChevronDown
- @/i18n/navigation: Link
- navItem, navTypes

i18n:
None — text comes from props (SiteHeaderClient handles i18n)

Accessibility:
Semantic links. The dropdown toggle is visual only (link is still clickable). Keyboard nav is basic browser default (Tab only, no Arrows because it's not ARIA menubar).

Notes:
This component is hidden on mobile (lg breakpoint). The dropdown appears on hover (no keyboard nav, just mouse). For true ARIA keyboard support, would need to add group:focus handlers or switch to a more complex ARIA menubar pattern.
