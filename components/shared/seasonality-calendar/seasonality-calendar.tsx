import type { Locale } from '@/constants/i18n'
import { cn } from '@/lib/utils'

interface SeasonalityCalendarProps {
  /** Months (1–12) with peak availability — strongest highlight. */
  peakMonths: number[]
  /** Months (1–12) in harvest — lighter highlight. */
  harvestMonths: number[]
  locale: Locale
  /** Legend labels (already translated by the caller). */
  harvestLabel: string
  peakLabel: string
}

/**
 * A 12-cell year strip visualising a product's harvest/peak window. Peak months
 * fill `forest`, harvest-only months a faint `forest/15`, the rest stay bone.
 * Month abbreviations are locale-aware via Intl (no dependency). Server-safe.
 */
export function SeasonalityCalendar({
  peakMonths,
  harvestMonths,
  locale,
  harvestLabel,
  peakLabel,
}: SeasonalityCalendarProps) {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short' })
  const months = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    return {
      month,
      // Day 1 of each month of a fixed non-leap year → short month name.
      label: formatter.format(new Date(Date.UTC(2025, index, 1))),
      isPeak: peakMonths.includes(month),
      isHarvest: harvestMonths.includes(month),
    }
  })

  return (
    <div>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
        {months.map(({ month, label, isPeak, isHarvest }) => (
          <div
            key={month}
            className={cn(
              'rounded-md py-2 text-center font-mono text-[0.58rem] uppercase tracking-wider',
              isPeak
                ? 'bg-forest text-paper'
                : isHarvest
                  ? 'bg-forest/15 text-forest'
                  : 'bg-bone text-ink-60',
            )}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-60">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-forest/15" aria-hidden />
          {harvestLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-forest" aria-hidden />
          {peakLabel}
        </span>
      </div>
    </div>
  )
}
