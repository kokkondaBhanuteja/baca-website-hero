'use client'

import { useId, useState } from 'react'

import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/constants/i18n'
import { cn } from '@/lib/utils'

export type LocalizedDraft = Partial<Record<Locale, string>>

export function hasAnyLocaleValue(draft: LocalizedDraft): boolean {
  return Object.values(draft).some((value) => value && value.trim().length > 0)
}

/**
 * One field, a tab per locale. English is the required base; other locales are
 * optional (a dot marks tabs that already have content).
 *
 * Accessibility:
 *   - The visible label is rendered with `htmlFor` pointing at the input/textarea.
 *   - When an error is present, the input/textarea gets `aria-invalid` and
 *     `aria-describedby` pointing at the error paragraph.
 *   - Locale tabs are buttons with `aria-pressed` indicating the active tab.
 */
export function LocalizedTextInput({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  error,
  hint,
  rows = 5,
}: {
  label: string
  value: LocalizedDraft
  onChange: (next: LocalizedDraft) => void
  multiline?: boolean
  required?: boolean
  error?: string[]
  /** Optional helper line under the label (e.g. "Paste Markdown"). */
  hint?: string
  /** Textarea height when multiline (default 5). */
  rows?: number
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>(DEFAULT_LOCALE)
  const reactId = useId()
  const inputId = `${reactId}-input`
  const errorId = `${reactId}-error`
  const hasError = Boolean(error && error.length > 0)

  return (
    <div className="mb-5">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-ink/80"
      >
        {label}
        {required && <span className="text-clay"> *</span>}
      </label>

      {hint && <p className="mb-2 text-xs text-ink-60">{hint}</p>}

      <div
        role="tablist"
        aria-label={`${label} — locale`}
        className="mb-2 flex flex-wrap gap-1"
      >
        {LOCALES.map((locale) => {
          const filled = Boolean(value[locale]?.trim())
          return (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={activeLocale === locale}
              aria-controls={inputId}
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
          id={inputId}
          rows={rows}
          value={value[activeLocale] ?? ''}
          onChange={(event) =>
            onChange({ ...value, [activeLocale]: event.target.value })
          }
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
      ) : (
        <input
          id={inputId}
          type="text"
          value={value[activeLocale] ?? ''}
          onChange={(event) =>
            onChange({ ...value, [activeLocale]: event.target.value })
          }
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
      )}

      {hasError && (
        <p id={errorId} className="mt-1 text-xs text-clay">
          {error!.join(', ')}
        </p>
      )}
    </div>
  )
}
