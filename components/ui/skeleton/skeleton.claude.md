---
kind: 'component'
name: 'Skeleton'
file: 'components/ui/skeleton/skeleton.tsx'
exports:
  - 'Skeleton'
imports_from:
  - '@/lib/utils'
---

# Skeleton

Purpose:
Animated placeholder block — used in all loading.tsx files while a Server Component streams. Matches bone/cream palette and pulses gently.

Used In:

- app/(site)/[locale]/blogs/loading.tsx (multiple)
- app/(site)/[locale]/blogs/[articleSlug]/loading.tsx (multiple)
- app/(site)/[locale]/products/loading.tsx (multiple)
- app/(site)/[locale]/gallery/loading.tsx (implied)

Props:

- className?: string — sizing/shape classes (e.g., 'h-6 w-full', 'aspect-[16/11] w-full rounded-2xl')

Business Logic:

- Renders a div with aria-hidden (decorative, not part of content)
- className includes: animate-pulse rounded-lg bg-bone
- The user's className is appended to set size/aspect ratio/border-radius

Dependencies:

- @/lib/utils — cn()

i18n:
None

Accessibility:
aria-hidden — fully decorative placeholder, not read by screen readers

Notes:
Animate-pulse is a built-in Tailwind animation. Each loading.tsx uses multiple Skeletons arranged in a layout that mimics the final page (e.g., eyebrow + heading + intro + image grid).
