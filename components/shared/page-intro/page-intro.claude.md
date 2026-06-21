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
- subheading?: string — optional short line below the H1 (e.g. contact page tagline)
- intro?: string — optional intro paragraph
- headingClassName?: string — optional extra classes merged onto the h1

Business Logic:

- Renders Eyebrow component with className='mb-4 text-ink-60'
- h1: max-w-[20ch] text-balance font-heading text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.04] text-ink
- Optional subheading if provided: mt-4 max-w-[60ch] text-base leading-relaxed text-ink-60
- Optional p if intro provided: max-w-[60ch] text-[15px] leading-relaxed text-ink-60

Dependencies:

- @/components/ui/eyebrow

i18n:
None — takes strings as props (caller handles translation)

Accessibility:
Semantic h1.

Notes:
This is used on every inner page in place of the hero section. The eyebrow, heading, and intro are all passed as props (caller must translate them). Simple, reusable layout component.
