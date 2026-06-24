/**
 * Single source of truth for the site's locales.
 *
 * `LOCALES` is a readonly tuple so `routing.locales` (and everything derived
 * from it) narrows to the `Locale` union instead of `string`.
 */
export const LOCALES = [
  'en',
  'ar',
  'de',
  'fr',
  'es',
  'nl',
  'it',
  'zh',
  'ja',
  'ko',
  'th',
  'vi',
  'id',
  'pt-BR',
  'bg',
  'hu',
  'nb',
  'pl',
  'ro',
  'ru',
  'tr',
  'uk',
] as const

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
  zh: {
    label: 'Chinese (Simplified)',
    native: '中文',
    dir: 'ltr',
    hreflang: 'zh-CN',
  },
  ja: { label: 'Japanese', native: '日本語', dir: 'ltr', hreflang: 'ja' },
  ko: { label: 'Korean', native: '한국어', dir: 'ltr', hreflang: 'ko' },
  th: { label: 'Thai', native: 'ภาษาไทย', dir: 'ltr', hreflang: 'th' },
  vi: { label: 'Vietnamese', native: 'Tiếng Việt', dir: 'ltr', hreflang: 'vi' },
  id: {
    label: 'Indonesian',
    native: 'Bahasa Indonesia',
    dir: 'ltr',
    hreflang: 'id',
  },
  'pt-BR': {
    label: 'Portuguese (Brazil)',
    native: 'Português',
    dir: 'ltr',
    hreflang: 'pt-BR',
  },
  bg: { label: 'Bulgarian', native: 'Български', dir: 'ltr', hreflang: 'bg' },
  hu: { label: 'Hungarian', native: 'Magyar', dir: 'ltr', hreflang: 'hu' },
  nb: { label: 'Norwegian', native: 'Norsk', dir: 'ltr', hreflang: 'nb' },
  pl: { label: 'Polish', native: 'Polski', dir: 'ltr', hreflang: 'pl' },
  ro: { label: 'Romanian', native: 'Română', dir: 'ltr', hreflang: 'ro' },
  ru: { label: 'Russian', native: 'Русский', dir: 'ltr', hreflang: 'ru' },
  tr: { label: 'Turkish', native: 'Türkçe', dir: 'ltr', hreflang: 'tr' },
  uk: { label: 'Ukrainian', native: 'Українська', dir: 'ltr', hreflang: 'uk' },
}

/** Convenience: text direction for a locale. */
export function dirOf(locale: Locale): Dir {
  return LOCALE_META[locale].dir
}
