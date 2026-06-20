---
kind: 'schema'
name: 'ProductSchema'
file: 'lib/server/validation/product-schema/product-schema.ts'
exports:
  - 'productInputSchema'
  - 'ProductInput'
imports_from:
  - 'zod'
  - '@/lib/server/validation/localized-text-schema'
called_by:
  - 'app/(admin)/admin/components/product-form/product-form.tsx'
  - 'app/api/products/[id]/route.ts'
  - 'app/api/products/route.ts'
  - 'lib/api-client/endpoints/products-api/products-api.ts'
  - 'lib/server/services/product-service/product-service.ts'
auth: 'n/a (validation schema)'
side_effects: 'Pure — no side effects.'
---

# ProductSchema

Purpose:
Zod schema for product creation/update. Validates localized name/summary/description, category relationship, image fields, and publication status.

Exports:

- productInputSchema: z.object — Full product form validation
- ProductInput: type — Inferred type from productInputSchema

Imports from:

- zod — z object builder
- @/lib/server/validation/localized-text-schema — optionalLocalizedText, requiredLocalizedText, slugField

Called by:

- app/api/products/route.ts (POST body validation)
- app/api/products/[id]/route.ts (PATCH body validation)
- lib/api-client/endpoints/products-api — type-only import for ProductInput

Business Logic:

- slug: slugField — lowercase letters, numbers, hyphens only, required, trimmed
- categoryId: z.string().min(1, 'Category is required') — non-empty UUID/ID of parent category
- name: requiredLocalizedText — 7-locale object, en required, all trimmed
- summary: optionalLocalizedText.nullish() — optional per-locale short description, may be null
- description: optionalLocalizedText.nullish() — optional per-locale full description, may be null
- imageUrl: z.string().nullish() — optional product image
- imagePublicId: z.string().nullish() — optional Cloudinary public ID
- sortOrder: z.number().int().default(0) — display order within category, defaults to 0
- isPublished: z.boolean().default(true) — visibility flag, defaults to true

Auth: n/a (validation schema)

Side Effects:
Pure — no side effects.

Notes:
name is required (en must be present); summary and description are fully optional (may be undefined or null). categoryId is a string (assumes UUID but zod doesn't validate format). Ordering is per-category via sortOrder scalar.
