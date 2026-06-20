---
kind: 'localization'
name: 'LocalizedValue'
file: 'lib/server/localization/localized-value/localized-value.ts'
exports:
  - 'localizedValue'
imports_from:
  - '@/constants/i18n'
  - '@/lib/shared/types/localized-text'
called_by:
  - 'lib/server/services/blog-article-service/blog-article-service.ts'
  - 'lib/server/services/category-service/category-service.ts'
  - 'lib/server/services/gallery-service/gallery-service.ts'
  - 'lib/server/services/product-service/product-service.ts'
auth: 'n/a (pure helper)'
side_effects: 'Pure — no side effects.'
---

# LocalizedValue

Purpose:
Resolves a JSONB localized field to a plain string for the active locale, with English fallback. Pure helper function used by all public read paths.

Exports:

- localizedValue(field: LocalizedText | null | undefined, locale: Locale): string — Resolves localized field to string

Imports from:

- @/constants/i18n — Locale type
- @/lib/shared/types/localized-text — LocalizedText type

Called by:

- All service public read functions (e.g., blog-article-service.listPublishedArticles, category-service.getCategoriesForLocale, product-service.listPublishedProducts, gallery-service.listPublishedGallery, etc.)

Business Logic:

- If field is null or undefined, returns empty string ''
- Attempts field[locale] (e.g. field['ar'] if locale is 'ar')
- If that is missing, falls back to field.en (English is guaranteed present by zod on write)
- Returns the resolved string (or empty string if en is also missing, which should not happen)

Auth: n/a (pure helper)

Side Effects:
Pure — no side effects.

Notes:
Used in every public read path to resolve JSONB { en, ar, de, … } to a scalar string. English fallback is guaranteed because zod enforces 'en' is required in all requiredLocalizedText schemas. If a locale is not translated, the public sees English instead of blank.
