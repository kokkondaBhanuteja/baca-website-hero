---
kind: 'component'
name: 'SeasonalityCalendar'
file: 'components/shared/seasonality-calendar/seasonality-calendar.tsx'
exports:
  - 'SeasonalityCalendar'
imports_from:
  - '@/constants/i18n'
  - '@/lib/utils'
---

# SeasonalityCalendar

Purpose:
A 12-cell year strip visualising a product's harvest/peak window on the product detail page. Peak
months fill `forest`, harvest-only months a faint `forest/15`, the rest stay `bone`. Month
abbreviations are locale-aware via `Intl.DateTimeFormat` (no dependency).

Used In:

- `app/(site)/[locale]/products/[slug]/page.tsx` — the Seasonality section.

Props:

- `peakMonths: number[]` — months 1–12 with peak availability (strongest highlight)
- `harvestMonths: number[]` — months 1–12 in harvest (lighter highlight)
- `locale: Locale` — drives the localized short month labels
- `harvestLabel: string` / `peakLabel: string` — already-translated legend labels

Business Logic:

- Builds 12 cells; each cell's fill is decided by membership in peak (wins) → harvest → none.
- `Intl.DateTimeFormat(locale, { month: 'short' })` on day 1 of each month of a fixed year (2025).
- Grid is `grid-cols-6 sm:grid-cols-12` (2 rows on mobile, one row on ≥sm). A small legend follows.

Dependencies:

- `@/constants/i18n`: Locale type · `@/lib/utils`: cn

i18n:
None — receives already-translated legend labels; month names come from `Intl` for the locale.

Accessibility:
Plain presentational cells; the legend swatches are `aria-hidden` with text labels beside them.

Notes:
Server-component-safe (no hooks). The admin sets harvest/peak via the `MonthPicker` editor on the
product form.
