---
kind: 'component'
name: 'MonthPicker'
file: 'app/(admin)/admin/components/month-picker/month-picker.tsx'
exports:
  - 'MonthPicker'
imports_from:
  - '@/lib/utils'
---

# MonthPicker

Purpose:
Admin editor for a set of months — a labeled row of 12 toggle chips (Jan–Dec) producing a sorted
array of month numbers (1–12). Drives the product's seasonality calendar.

Used In:

- `app/(admin)/admin/components/product-form/product-form.tsx` — twice (Harvest months, Peak months).

Props:

- `label: string` — the group heading (e.g. "Harvest months")
- `value: number[]` — selected months (1–12)
- `onChange: (next: number[]) => void` — receives the toggled, re-sorted array

Business Logic:

- 12 toggle buttons in a `grid-cols-6` (2 rows of 6 — mobile-friendly). Active chip → `bg-forest text-paper`.
- Toggling adds/removes the month and re-sorts ascending.

Dependencies:

- `@/lib/utils`: cn

i18n:
None — admin app is English-only; month labels are fixed 3-letter English abbreviations.

Accessibility:
Each chip is a `<button>` with `aria-pressed` reflecting selection.

Notes:
Reused for both harvest and peak month sets; the public `SeasonalityCalendar` renders the result.
