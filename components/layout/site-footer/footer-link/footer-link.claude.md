---
kind: 'component'
name: 'FooterLink'
file: 'components/layout/site-footer/footer-link/footer-link.tsx'
exports:
  - 'FooterLink'
imports_from:
  - 'lucide-react'
  - '@/i18n/navigation'
---

# FooterLink

Purpose:
Hover-underline link primitive: renders a link with animated saffron underline on hover + arrow icon slide-in.

Used In:

- FooterColumns — every footer link item

Props:

- href: string — link destination
- children: React.ReactNode — link text

Business Logic:

- Link (from i18n navigation) with group/link class
- Text: span relative with inline-flex gap-1.5 items-center, text-[14px] text-paper/65 hover:text-paper transition-colors
- Underline: absolute span -bottom-0.5 start-0 h-px w-0 bg-saffron transition-all duration-300 group-hover/link:w-full (grows from 0 to 100% on hover)
- Arrow: ArrowUpRight h-3.5 w-3.5, -translate-x-1 opacity-0, group-hover/link:translate-x-0 group-hover/link:opacity-100 (slides in from left on hover)

Dependencies:

- lucide-react: ArrowUpRight
- @/i18n/navigation: Link

i18n:
None

Accessibility:
Semantic link with text.

Notes:
Simple, reusable link component with a polished hover effect (underline grow + arrow slide). Used throughout the footer for consistency. The group/link namespace prevents conflicts with other group scopes.
