---
kind: 'component'
name: 'Certifications'
file: 'components/sections/certifications/certifications.tsx'
exports:
  - 'Certifications'
imports_from:
  - 'next-intl/server'
  - '@/constants/animations'
  - '@/constants/sections/certifications'
  - '@/constants/routes'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
---

# Certifications

Purpose:
Grid of certification/compliance badges with icon, name, and localized sub-label. Each badge fades in on scroll with stagger.

Used In:

- Home page — appears below Approach, anchor #compliance

Props:

- No props — server component

Business Logic:

- Calls await getTranslations('certifications') server-side
- Renders Reveal wrapper around intro (eyebrow + h2 + optional text)
- Maps CERTS constant array; each cert is wrapped in Reveal with delay: index \* REVEAL_STAGGER_MS.CERTIFICATION
- Each badge: Reveal → flex gap-3 border-t pt-5 → Icon (from cert.icon) + text block
- Icon: h-8 w-8 shrink-0 text-saffron strokeWidth 1.4
- Grid: sm:grid-cols-3 lg:grid-cols-4 on desktop, 2-col mobile

Dependencies:

- @/constants/animations — REVEAL_STAGGER_MS
- @/constants/sections/certifications — CERTS array with {key, icon, name, ...}
- @/components/ui/eyebrow
- @/components/ui/reveal
- next-intl: getTranslations

i18n:
Namespace: 'certifications'. Keys: 'eyebrow', 'heading', 'intro', 'items.{cert.key}.sub'.

Accessibility:
Semantic h2. Icons have aria-hidden. Text is semantic.

Notes:
The CERTS constant maps to Lucide icons (imported dynamically); each cert has a key that matches the i18n namespace. Stagger delay is pulled from REVEAL_STAGGER_MS.CERTIFICATION (a constant used across sections for consistency).
