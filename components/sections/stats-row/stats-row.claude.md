---
kind: 'component'
name: 'StatsRow'
file: 'components/sections/stats-row/stats-row.tsx'
exports:
  - 'StatsRow'
imports_from:
  - 'next-intl'
  - '@/constants/animations'
  - '@/constants/sections/stats'
---

# StatsRow

Purpose:
4-stat count-up row: numbers animate from 0 to target on intersection, with IntersectionObserver + RAF animation frame.

Used In:

- Home page

Props:

- No props — client component

Business Logic:

- CountUp subcomponent: each stat wrapped in useEffect + IntersectionObserver threshold INTERSECTION_THRESHOLD.REVEAL
- On first intersect: started.current flag prevents re-run, then RAF loop ticks from 0 to stat.value over STATS_COUNTUP_DURATION_MS
- Easing: eased = 1 - Math.pow(1 - progress, 3) (ease-out cubic)
- If reduce-motion: jumps immediately to stat.value
- Formats with toLocaleString('en-US')
- Displays: stat.prefix + formatted number + saffron stat.suffix
- Main component maps STATS array via useTranslations('stats')
- Grid: sm:grid-cols-2 lg:grid-cols-4 mobile-to-desktop

Dependencies:

- React hooks: useEffect, useRef, useState
- next-intl: useTranslations
- @/constants/animations — INTERSECTION_THRESHOLD, STATS_COUNTUP_DURATION_MS
- @/constants/sections/stats — STATS array with {key, value, prefix, suffix}

i18n:
Namespace: 'stats'. Keys: 'items.{stat.key}' for each label.

Accessibility:
Semantic structure. The numbers are displayed text.

Notes:
Each stat is independent (its own observer + RAF loop). The started flag ensures count-up only runs once (the observer disconnects after first intersect). The suffix is always rendered in saffron color.
