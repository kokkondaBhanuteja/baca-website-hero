'use client'

import { useLocale, useTranslations } from 'next-intl'

import { LOCALES, LOCALE_META, type Locale } from '@/constants/i18n'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { Dropdown } from './dropdown'

/**
 * Locale picker built on the custom Dropdown (no native select). Switches
 * language while preserving the current path.
 */
export function LanguageSwitcher({
  tone = 'ink',
  className,
}: {
  tone?: 'ink' | 'paper'
  className?: string
}) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('languageSwitcher')

  const options = LOCALES.map((value) => ({
    value,
    label: LOCALE_META[value].native,
  }))

  return (
    <Dropdown
      value={locale}
      options={options}
      onChange={(next) => router.replace(pathname, { locale: next as Locale })}
      ariaLabel={t('label')}
      menuAlign="end"
      className={className}
      buttonClassName={cn(
        'rounded-full px-2.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors',
        tone === 'ink'
          ? 'text-ink-60 hover:text-ink'
          : 'text-paper/70 hover:text-paper',
      )}
    />
  )
}
