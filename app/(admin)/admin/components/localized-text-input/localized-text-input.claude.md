---
kind: 'component'
name: 'LocalizedTextInput'
file: 'app/(admin)/admin/components/localized-text-input/localized-text-input.tsx'
exports:
  - 'hasAnyLocaleValue'
  - 'LocalizedTextInput'
  - 'LocalizedDraft'
imports_from:
  - '@/constants/i18n'
  - '@/lib/utils'
---

# LocalizedTextInput

Purpose:
Multi-locale input: tabs for each locale, English required, others optional. Rendered as text or textarea. Dots indicate filled locales.

Used In:

- All admin entity forms that have i18n content: product-form, category-form, blog-article-form, gallery-uploader-form

Props:

- label: string — field label
- value: LocalizedDraft — current locale values {en?: '...', ar?: '...', ...}
- onChange: (next: LocalizedDraft) => void — callback when text changes
- multiline?: boolean — textarea if true (default: false)
- required?: boolean — marks EN required (default: false)
- error?: string[] — field errors to display
- hint?: string — optional helper line under the label (e.g. "Paste Markdown")
- rows?: number — textarea height when multiline (default: 5; blog body uses 16)

Business Logic:

- useState: activeLocale (starts at DEFAULT_LOCALE, typically 'en')
- Renders tabs per LOCALES: activeLocale tab is bg-ink text-paper, others are bg-bone text-ink-60 hover
- Tab shows locale code (e.g., 'EN', 'AR') + asterisk if DEFAULT_LOCALE && required + filled dot (saffron •) if locale has content
- Input/textarea: controlled value={value[activeLocale] ?? ''}, onChange updates {[activeLocale]: newValue}
- Error display below input if error array is non-empty
- hasAnyLocaleValue() exported helper: returns true if any locale has trimmed content

Dependencies:

- React hooks: useState
- @/constants/i18n — LOCALES, DEFAULT_LOCALE
- @/lib/utils — cn()

i18n:
None — English only (this is an admin input component)

Accessibility:
Label linked via htmlFor. Required field marked with asterisk. Errors linked via aria-describedby.

Notes:
LocalizedDraft is exported type Partial<Record<Locale, string>>. The component allows editing any/all locales; required only enforces EN (caller decides if others are required). The hasAnyLocaleValue helper is used by forms to decide whether to send nullable fields.
