---
kind: 'component'
name: 'Approach'
file: 'components/sections/approach/approach.tsx'
exports:
  - 'Approach'
imports_from:
  - 'gsap'
  - 'gsap/ScrollTrigger'
  - 'next-intl'
  - '@/constants/sections/approach'
  - '@/components/ui/eyebrow'
---

# Approach

Purpose:
Four-pillar value-prop section with scroll-triggered stagger animation. Each card has a top border rule that scales in on scroll.

Used In:

- Home page (app/(site)/[locale]/page.tsx) — one of the main home sections

Props:

- No props — server component that calls await getTranslations('approach')

Business Logic:

- useEffect on mount; checks (prefers-reduced-motion: reduce)
- If reduce-motion: sets .approach-card to opacity 1 y 0; .approach-rule to scaleX 1
- If motion allowed: sets initial state opacity 0 y 40 + scaleX 0, then creates ScrollTrigger start 'top 72%' once: true
- onEnter fires: animates .approach-card to opacity 1 y 0 over 0.9s ease 'power3.out' with stagger 0.12, AND .approach-rule to scaleX 1 over 0.8s ease 'power2.out' with stagger 0.12
- Section is scroll-mt-header-offset for anchor nav (#approach)
- Grid layout: lg:grid-cols-12 with left col (lg:col-span-4) for intro, right col (lg:col-span-8) for cards in 2-column grid
- Each card is .approach-card with border-t border-line pt-7 and .approach-rule (absolute span scaleX origin-left/rtl:origin-right)

Dependencies:

- React hooks: useEffect, useRef
- gsap + gsap/ScrollTrigger
- next-intl: useTranslations
- @/constants/sections/approach — PILLARS array with {key, n, ...}
- @/components/ui/eyebrow — Eyebrow component

i18n:
Namespace: 'approach'. Keys: 'eyebrow', 'heading', 'intro', 'pillars.{pillar.key}.title', 'pillars.{pillar.key}.body' (dynamic keys cast as Parameters<typeof t>[0]).

Accessibility:
Semantic h2, h3 structure. The animated rule has aria-hidden. Standard text hierarchy.

Notes:
The rule-scaleX animation and card stagger are paired but use separate durations (0.8 vs 0.9) to create a rhythm. The PILLARS constant defines the 4 items (typically 4 pillars of the company's approach). Origin-left/rtl:origin-right ensures the rule scales from the start (LTR) or end (RTL).
