---
kind: 'component'
name: 'SpecListInput'
file: 'app/(admin)/admin/components/spec-list-input/spec-list-input.tsx'
exports:
  - 'SpecListInput'
imports_from:
  - 'lucide-react'
  - '@/lib/shared/types/catalogue-dto'
---

# SpecListInput

Purpose:
Admin editor for a product's specifications grid — a repeatable list of `{ label, value }` rows
(Variety, Grade, Moisture, HS code, …). English-only (trade specs aren't localized).

Used In:

- `app/(admin)/admin/components/product-form/product-form.tsx` (the `specs` field).

Props:

- `value: ProductSpec[]` — current rows
- `onChange: (next: ProductSpec[]) => void`

Business Logic:

- Each row: a Label input (`w-2/5`) + a Value input (`flex-1`) + a remove (`X`) button.
- "Add specification" appends an empty `{ label: '', value: '' }` row.
- The form filters rows with an empty label or value before building the payload.

Dependencies:

- `lucide-react`: Plus, X · `@/lib/shared/types/catalogue-dto`: `ProductSpec` (type)

i18n:
None — admin app is English-only.

Accessibility:
Each input has an `aria-label` (`Specification N label/value`); the remove button has an `aria-label`.

Notes:
Mobile-friendly: rows are a single flex line that stays usable on narrow screens; the chip grid wraps.
