import type { Locale } from '@/constants/i18n'

/**
 * Locale-aware long date (e.g. "21 June 2026") from an ISO string. Pure and
 * both-sides safe — uses the platform `Intl.DateTimeFormat`, no dependency.
 * Returns '' for null/invalid input so callers can render nothing.
 */
export function formatPublishedDate(
  iso: string | null | undefined,
  locale: Locale,
): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)
}
