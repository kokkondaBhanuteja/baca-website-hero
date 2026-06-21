'use client'

import { Plus, X } from 'lucide-react'

import type { ProductSpec } from '@/lib/shared/types/catalogue-dto'

/**
 * Repeatable key/value editor for a product's specifications grid. Each row is a
 * `{ label, value }` pair (e.g. "Grade" / "AGEB · AGB · AGS"). Empty rows are
 * filtered by the caller before submit. Not localized — trade specs are English.
 */
export function SpecListInput({
  value,
  onChange,
}: {
  value: ProductSpec[]
  onChange: (next: ProductSpec[]) => void
}) {
  function update(index: number, patch: Partial<ProductSpec>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...value, { label: '', value: '' }])
  }

  return (
    <div className="mb-5">
      <p className="mb-1.5 text-sm font-medium text-ink/80">Specifications</p>
      <p className="mb-3 text-xs text-ink-60">
        Key/value rows shown as a grid on the product page (Variety, Grade,
        Moisture, HS code, …).
      </p>

      <div className="flex flex-col gap-2">
        {value.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={row.label}
              onChange={(event) => update(index, { label: event.target.value })}
              placeholder="Label"
              aria-label={`Specification ${index + 1} label`}
              className="w-2/5 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
            <input
              type="text"
              value={row.value}
              onChange={(event) => update(index, { value: event.target.value })}
              placeholder="Value"
              aria-label={`Specification ${index + 1} value`}
              className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Remove specification ${index + 1}`}
              className="shrink-0 rounded-lg border border-line p-2 text-ink-60 transition-colors hover:text-clay"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink/70 transition-colors hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" />
        Add specification
      </button>
    </div>
  )
}
