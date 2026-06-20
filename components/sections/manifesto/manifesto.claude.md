---
kind: 'component'
name: 'Manifesto'
file: 'components/sections/manifesto/manifesto.tsx'
exports:
  - 'Manifesto'
imports_from:
  - 'next-intl/server'
  - '@/constants/animations'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
  - '@/components/ui/reveal-image'
  - '@/components/ui/rich'
---

# Manifesto

Purpose:
Why-we're-here section: headline + body text + hero-style reveal image (Lusion-style clip + scale). Anchor #why-we-re-here.

Used In:

- Home page (app/(site)/[locale]/page.tsx)

Props:

- No props — server component

Business Logic:

- Three staggered Reveal elements: eyebrow, headline (with richTags), body
- RevealImage on the right: /images/who-we-are.jpg, aspect-[4/5], rounded-2xl, border border-line
- Grid layout: lg:grid-cols-12, left col span-7 (text), right col span-5 (image)
- Uses t.rich('headline', richTags) for saffron italic emphasis
- Delays: REVEAL_STAGGER_MS.MANIFESTO_PRIMARY and MANIFESTO_SECONDARY applied to successive Reveal wrappers

Dependencies:

- next-intl: getTranslations
- @/constants/animations — REVEAL_STAGGER_MS
- @/components/ui/eyebrow, reveal, reveal-image, rich: richTags

i18n:
Namespace: 'manifesto'. Keys: 'eyebrow', 'headline' (rich), 'body', 'imageAlt'.

Accessibility:
Semantic h2. RevealImage alt text required.

Notes:
The section has scroll-mt-header-offset for anchor nav. The RevealImage uses the cinematic clip+scale reveal (not MediaReveal). The stagger delays use specific constants (MANIFESTO_PRIMARY, MANIFESTO_SECONDARY) rather than a simple index loop.
