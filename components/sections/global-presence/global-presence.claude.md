---
kind: 'component'
name: 'GlobalPresence'
file: 'components/sections/global-presence/global-presence.tsx'
exports:
  - 'GlobalPresence'
imports_from:
  - 'next-intl/server'
  - '@/constants/animations'
  - '@/constants/sections/regions'
  - '@/components/ui/eyebrow'
  - '@/components/ui/reveal'
  - '@/components/ui/rich'
---

# GlobalPresence

Purpose:
4-stat strip showing regional presence (countries, certifications, etc.) over a parallax-enabled background image.

Used In:

- Home page — appears after Approach

Props:

- No props — server component

Business Logic:

- Background: hero image /images/global-port.jpg with data-parallax (picked up by ScrollFX on home), opacity-40, absolute inset-0 with pointer-events-none
- Gradient overlay: from-ink/90 via-ink/60 to-ink/35 (dark overlay for text readability)
- Content: Reveal wrapper around intro + dl grid
- Maps REGIONS array; each region wrapped in Reveal with delay: index \* REVEAL_STAGGER_MS.GLOBAL_PRESENCE
- Each region: <dt> with large number (e.g., '75'), <dd> with localized text
- Grid: lg:grid-cols-4 on desktop, 2-col mobile

Dependencies:

- next-intl: getTranslations
- @/constants/animations — REVEAL_STAGGER_MS
- @/constants/sections/regions — REGIONS array
- @/components/ui/eyebrow, reveal, rich: richTags

i18n:
Namespace: 'globalPresence'. Keys: 'eyebrow', 'heading' (supports t.rich), 'body', 'items.{region.key}'.

Accessibility:
Semantic <dl><dt><dd> structure. Image is decorative aria-hidden.

Notes:
The [data-parallax] attribute is not used here in the image itself (the scrollFX driver picks it up on home). The gradient overlay ensures text legibility over the background. The region values are hardcoded in the REGIONS constant (e.g., 75 countries, 3 certifications).
