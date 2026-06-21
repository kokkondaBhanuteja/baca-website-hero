---
kind: 'validation'
name: 'blog-type-schema'
file: 'lib/server/validation/blog-type-schema/blog-type-schema.ts'
exports:
  - 'blogTypeInputSchema'
  - 'BlogTypeInput'
imports_from:
  - 'zod'
  - '@/lib/server/validation/localized-text-schema'
---

# blog-type-schema

Purpose: zod schema validating admin create/update of a blog type.

Business Logic:

- slug (slugField), name (requiredLocalizedText — `en` required), sortOrder (0–10000, default 0), isPublished (default true). `.strict()` rejects unknown keys.

Used In: `app/api/blog-types/route.ts`, `app/api/blog-types/[id]/route.ts`, `blog-type-service`, `blog-type-form`.
