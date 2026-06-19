'use client'

import { useState } from 'react'

import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/constants/i18n'
import { cn } from '@/lib/utils'

export type LocalizedDraft = Partial<Record<Locale, string>>

export function hasAnyLocaleValue(draft: LocalizedDraft): boolean {
  return Object.values(draft).some((value) => value && value.trim().length > 0)
}

/**
 * One field, a tab per locale. English is the required base; other locales are
 * optional (a dot marks tabs that already have content).
 */
export function LocalizedTextInput({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  error,
}: {
  label: string
  value: LocalizedDraft
  onChange: (next: LocalizedDraft) => void
  multiline?: boolean
  required?: boolean
  error?: string[]
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>(DEFAULT_LOCALE)

  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-clay"> *</span>}
      </label>

      <div className="mb-2 flex flex-wrap gap-1">
        {LOCALES.map((locale) => {
          const filled = Boolean(value[locale]?.trim())
          return (
            <button
              key={locale}
              type="button"
              onClick={() => setActiveLocale(locale)}
              className={cn(
                'rounded-md px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider transition-colors',
                activeLocale === locale
                  ? 'bg-ink text-paper'
                  : 'bg-bone text-ink-60 hover:text-ink',
              )}
            >
              {locale}
              {locale === DEFAULT_LOCALE && required ? '*' : ''}
              {filled && <span className="ms-1 text-saffron">•</span>}
            </button>
          )
        })}
      </div>

      {multiline ? (
        <textarea
          rows={5}
          value={value[activeLocale] ?? ''}
          onChange={(event) =>
            onChange({ ...value, [activeLocale]: event.target.value })
          }
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
      ) : (
        <input
          type="text"
          value={value[activeLocale] ?? ''}
          onChange={(event) =>
            onChange({ ...value, [activeLocale]: event.target.value })
          }
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
      )}

      {error && error.length > 0 && (
        <p className="mt-1 text-xs text-clay">{error.join(', ')}</p>
      )}
    </div>
  )
}
