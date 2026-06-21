'use client'

import { cn } from '@/lib/utils'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * A labeled row of 12 toggle chips (Jan–Dec) producing a sorted array of month
 * numbers (1–12). Used twice on the product form — once for harvest months, once
 * for peak months — to drive the seasonality calendar on the product page.
 */
export function MonthPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: number[]
  onChange: (next: number[]) => void
}) {
  function toggle(month: number) {
    const next = value.includes(month)
      ? value.filter((selected) => selected !== month)
      : [...value, month]
    onChange(next.sort((first, second) => first - second))
  }

  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-medium text-ink/80">{label}</p>
      <div className="grid grid-cols-6 gap-1.5">
        {MONTHS.map((name, index) => {
          const month = index + 1
          const active = value.includes(month)
          return (
            <button
              key={month}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(month)}
              className={cn(
                'rounded-md py-1.5 font-mono text-[0.62rem] uppercase tracking-wider transition-colors',
                active
                  ? 'bg-forest text-paper'
                  : 'bg-bone text-ink-60 hover:text-ink',
              )}
            >
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
