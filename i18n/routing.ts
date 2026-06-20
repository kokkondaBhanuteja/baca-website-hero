import { defineRouting } from 'next-intl/routing'

import { DEFAULT_LOCALE, LOCALES } from '@/constants/i18n'

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // English stays at `/`; other locales are prefixed (`/ar`, `/de`, …).
  localePrefix: 'as-needed',
})
