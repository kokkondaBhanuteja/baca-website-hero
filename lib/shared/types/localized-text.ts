import type { Locale } from '@/constants/i18n'

/**
 * A translatable value stored as a JSONB object on a DB row. `en` is always
 * required (enforced by zod on write); other locales are optional and fall back
 * to `en` at read time via `localizedValue()`. Type-only — safe to import from
 * both server and client.
 */
export type LocalizedText = { en: string } & Partial<
  Record<Exclude<Locale, 'en'>, string>
>
