---
kind: 'component'
name: 'PageIntro'
file: 'components/shared/page-intro/page-intro.tsx'
exports:
  - 'PageIntro'
imports_from:
  - '@/components/ui/eyebrow'
---

# PageIntro

Purpose:
Shared inner-page header: eyebrow + oversized H1 + optional intro text. Used on all non-home pages.

Used In:

- Blogs page
- Blog detail page
- Products page
- Gallery page
- Contact page
- \_about page

Props:

- eyebrow: string — the label (e.g., 'Blog', 'Shop')
- heading: string — the main H1 text
- intro?: string — optional intro paragraph

Business Logic:

- Renders Eyebrow component with className='mb-4 text-ink-60'
- h1: max-w-[20ch] text-balance font-heading text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.04] text-ink
- Optional p if intro provided: max-w-[60ch] text-[15px] leading-relaxed text-ink-60

Dependencies:

- @/components/ui/eyebrow

i18n:
None — takes strings as props (caller handles translation)

Accessibility:
Semantic h1.

Notes:
This is used on every inner page in place of the hero section. The eyebrow, heading, and intro are all passed as props (caller must translate them). Simple, reusable layout component.
