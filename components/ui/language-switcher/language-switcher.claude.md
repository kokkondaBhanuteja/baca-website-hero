---
kind: 'component'
name: 'LanguageSwitcher'
file: 'components/ui/language-switcher/language-switcher.tsx'
exports:
  - 'LanguageSwitcher'
imports_from:
  - 'next-intl'
  - '@/constants/i18n'
  - '@/i18n/navigation'
  - '@/lib/utils'
  - '@/components/ui/dropdown'
---

# LanguageSwitcher

Purpose:
Locale picker dropdown built on custom Dropdown. Switches language while preserving the current URL path.

Used In:

- SiteHeaderClient (desktop nav, hidden on mobile)
- SiteHeaderMobileMenu (mobile overlay)
- appears in both desktop and mobile navigation

Props:

- tone?: 'ink' | 'paper' — text color (default: 'ink')
- className?: string — outer container Tailwind

Business Logic:

- useLocale() gets current locale; usePathname() gets current path
- LOCALES array + LOCALE_META map to build options: {value: locale, label: LOCALE_META[locale].native}
- onChange calls router.replace(pathname, {locale: next}) — preserves path, swaps locale
- menuAlign='end' positions dropdown to the right
- buttonClassName: rounded-full px-2.5 py-1.5, font-mono uppercase tracking-wider, tone determines text-ink-60 hover:text-ink or text-paper/70 hover:text-paper

Dependencies:

- next-intl: useLocale, useTranslations
- @/constants/i18n — LOCALES, LOCALE_META
- @/i18n/navigation — usePathname, useRouter (i18n-aware)
- @/lib/utils — cn()
- @/components/ui/dropdown — Dropdown component

i18n:
Namespace: 'languageSwitcher', key 'label' for aria-label. Dropdown renders native language names from LOCALE_META[locale].native.

Accessibility:
aria-label from t('languageSwitcher.label'). Inherits Dropdown keyboard a11y (Arrow/Enter/Escape).

Notes:
This is one of the rare ui/ components that calls useTranslations (because the label is about locales themselves, not page content). Dropdown menuAlign='end' ensures it doesn't overflow on narrow screens.
