---
kind: 'schema'
name: 'LocalizedTextSchema'
file: 'lib/server/validation/localized-text-schema/localized-text-schema.ts'
exports:
  - 'requiredLocalizedText'
  - 'optionalLocalizedText'
  - 'slugField'
imports_from:
  - 'zod'
called_by:
  - 'lib/server/validation/blog-article-schema/blog-article-schema.ts'
  - 'lib/server/validation/category-schema/category-schema.ts'
  - 'lib/server/validation/gallery-schema/gallery-schema.ts'
  - 'lib/server/validation/product-schema/product-schema.ts'
auth: 'n/a (validation schema)'
side_effects: 'Pure — no side effects.'
---

# LocalizedTextSchema

Purpose:
Zod schemas for JSONB localized fields. Defines requiredLocalizedText (en mandatory, others optional) and optionalLocalizedText (all optional), plus the slug field validator.

Exports:

- requiredLocalizedText: z.object — 7-locale object with en required (min 1 char after trim), others optional
- optionalLocalizedText: z.object — 7-locale object with all fields optional (may be empty strings)
- slugField: z.string — slug validator: min 1, regex [a-z0-9-]+ only

Imports from:

- zod — z object builder

Called by:

- lib/server/validation/blog-article-schema — imports requiredLocalizedText, slugField
- lib/server/validation/category-schema — imports optionalLocalizedText, requiredLocalizedText, slugField
- lib/server/validation/product-schema — imports optionalLocalizedText, requiredLocalizedText, slugField
- lib/server/validation/gallery-schema — imports optionalLocalizedText

Business Logic:

- requiredLocalizedText object with fields: en (required min 1 char), ar/de/fr/es/nl/it (all optional, trimmed strings)
- optionalLocalizedText object with fields: en/ar/de/fr/es/nl/it (all optional, trimmed strings)
- slugField: z.string().trim().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, error message) — lowercase alphanumeric + hyphens only

Auth: n/a (validation schema)

Side Effects:
Pure — no side effects.

Notes:
These are composable zod schemas, not types. They define the shape of JSONB localized columns. All locale fields are trimmed at validation time. en is required in requiredLocalizedText to guarantee a fallback at read time (localizedValue falls back to en if requested locale is missing). slugField prevents non-ASCII slugs.
