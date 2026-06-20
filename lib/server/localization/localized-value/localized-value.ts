import type { Locale } from '@/constants/i18n'
import type { LocalizedText } from '@/lib/shared/types/localized-text'

/**
 * Resolves a JSONB localized field to a plain string for the active locale,
 * falling back to English (always present by the write-time invariant).
 */
export function localizedValue(
  field: LocalizedText | null | undefined,
  locale: Locale,
): string {
  if (!field) return ''
  return field[locale] ?? field.en ?? ''
}
