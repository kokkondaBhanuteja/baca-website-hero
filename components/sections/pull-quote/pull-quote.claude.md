---
kind: 'component'
name: 'PullQuote'
file: 'components/sections/pull-quote/pull-quote.tsx'
exports:
  - 'PullQuote'
imports_from:
  - 'next-intl/server'
  - '@/components/ui/reveal'
---

# PullQuote

Purpose:
Single oversized editorial testimonial block: large blockquote + author portrait + name + title.

Used In:

- Home page

Props:

- No props — server component

Business Logic:

- Reveal wrapper around <figure>
- <blockquote>: saffron opening + closing quotes, font-heading text-[clamp(1.75rem,4vw,3rem)] font-light text-ink
- <figcaption>: portrait img (grayscale) + name + title
- Portrait: h-14 w-14 rounded-full object-cover object-[50%_15%] grayscale

Dependencies:

- next-intl: getTranslations
- @/components/ui/reveal

i18n:
Namespace: 'pullQuote'. Keys: 'quote', 'imageAlt', 'name', 'title'.

Accessibility:
Semantic <figure><blockquote><figcaption> structure. Portrait has alt text.

Notes:
Simple, editorial-style quote block. The quotes are rendered as saffron text (not part of the i18n string). This appears once on the home page as a testimonial.
