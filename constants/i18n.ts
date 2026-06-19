/**
 * Single source of truth for the site's locales.
 *
 * `LOCALES` is a readonly tuple so `routing.locales` (and everything derived
 * from it) narrows to the `Locale` union instead of `string`.
 */
export const LOCALES = ['en', 'ar', 'de', 'fr', 'es', 'nl', 'it'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export type Dir = 'ltr' | 'rtl'

export interface LocaleMeta {
  /** English name of the language (for internal/aria use). */
  label: string
  /** Endonym — how speakers write the language name themselves. */
  native: string
  /** Text direction; drives the `dir` attribute on `<html>`. */
  dir: Dir
  /** BCP-47 tag for `hreflang`/`lang`. */
  hreflang: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { label: 'English', native: 'English', dir: 'ltr', hreflang: 'en' },
  ar: { label: 'Arabic', native: 'العربية', dir: 'rtl', hreflang: 'ar' },
  de: { label: 'German', native: 'Deutsch', dir: 'ltr', hreflang: 'de' },
  fr: { label: 'French', native: 'Français', dir: 'ltr', hreflang: 'fr' },
  es: { label: 'Spanish', native: 'Español', dir: 'ltr', hreflang: 'es' },
  nl: { label: 'Dutch', native: 'Nederlands', dir: 'ltr', hreflang: 'nl' },
  it: { label: 'Italian', native: 'Italiano', dir: 'ltr', hreflang: 'it' },
}

/** Convenience: text direction for a locale. */
export function dirOf(locale: Locale): Dir {
  return LOCALE_META[locale].dir
}
