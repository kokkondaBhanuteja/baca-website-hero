---
kind: 'schema'
name: 'CategorySchema'
file: 'lib/server/validation/category-schema/category-schema.ts'
exports:
  - 'categoryInputSchema'
  - 'CategoryInput'
imports_from:
  - 'zod'
  - '@/lib/server/validation/localized-text-schema'
called_by:
  - 'app/(admin)/admin/components/category-form/category-form.tsx'
  - 'app/api/categories/[id]/route.ts'
  - 'app/api/categories/route.ts'
  - 'lib/api-client/endpoints/categories-api/categories-api.ts'
  - 'lib/server/services/category-service/category-service.ts'
auth: 'n/a (validation schema)'
side_effects: 'Pure — no side effects.'
---

# CategorySchema

Purpose:
Zod schema for product category creation/update. Validates localized name/description, image fields, and publication status.

Exports:

- categoryInputSchema: z.object — Full category form validation
- CategoryInput: type — Inferred type from categoryInputSchema

Imports from:

- zod — z object builder
- @/lib/server/validation/localized-text-schema — optionalLocalizedText, requiredLocalizedText, slugField

Called by:

- app/api/categories/route.ts (POST body validation)
- app/api/categories/[id]/route.ts (PATCH body validation)
- lib/api-client/endpoints/categories-api — type-only import for CategoryInput

Business Logic:

- slug: slugField — lowercase letters, numbers, hyphens only, required, trimmed
- name: requiredLocalizedText — 7-locale object, en required, all trimmed
- description: optionalLocalizedText.nullish() — optional per-locale text, may be null
- imageUrl: z.string().nullish() — optional category image
- imagePublicId: z.string().nullish() — optional Cloudinary public ID
- sortOrder: z.number().int().default(0) — display order, defaults to 0
- isPublished: z.boolean().default(true) — visibility flag, defaults to true

Auth: n/a (validation schema)

Side Effects:
Pure — no side effects.

Notes:
name is required (en must be present); description is fully optional (may be undefined or null). Difference from blog articles: no status enum, just isPublished boolean. sortOrder is nullable in input but defaults to 0.
