---
kind: 'schema'
name: 'BlogArticleSchema'
file: 'lib/server/validation/blog-article-schema/blog-article-schema.ts'
exports:
  - 'blogArticleInputSchema'
  - 'BlogArticleInput'
imports_from:
  - 'zod'
  - '@/lib/server/validation/localized-text-schema'
called_by:
  - 'app/(admin)/admin/components/blog-article-form/blog-article-form.tsx'
  - 'app/api/blog-articles/[id]/route.ts'
  - 'app/api/blog-articles/route.ts'
  - 'lib/api-client/endpoints/blog-articles-api/blog-articles-api.ts'
  - 'lib/server/services/blog-article-service/blog-article-service.ts'
auth: 'n/a (validation schema)'
side_effects: 'Pure — no side effects.'
---

# BlogArticleSchema

Purpose:
Zod schema for blog article creation/update. Validates localized title/excerpt/body, the author
byline (name/role/avatar), metadata (status, featured), and image fields.

Exports:

- blogArticleInputSchema: z.object — Full article form validation
- BlogArticleInput: type — Inferred type from blogArticleInputSchema

Imports from:

- zod — z object builder
- @/lib/server/validation/localized-text-schema — requiredLocalizedText, slugField

Called by:

- app/api/blog-articles/route.ts (POST body validation)
- app/api/blog-articles/[id]/route.ts (PATCH body validation)
- lib/api-client/endpoints/blog-articles-api — type-only import for BlogArticleInput

Business Logic:

- slug: slugField — lowercase letters, numbers, hyphens only, required, trimmed
- category: z.enum(['INDUSTRY_INSIGHTS', 'IMPACT_STORIES', 'COMMUNITY_ENGAGEMENT']) — enum required
- title: requiredLocalizedText — 7-locale object, en required, all trimmed
- excerpt: requiredLocalizedText — same as title
- body: requiredLocalizedText — same as title
- coverImageUrl: z.string().nullish() — optional Cloudinary URL
- coverImagePublicId: z.string().nullish() — optional Cloudinary public ID (for deletion)
- authorName: z.string().trim().max(120).nullish() — byline name (scalar; page falls back to "BACA Team")
- authorRole: z.string().trim().max(120).nullish() — byline role/title (scalar)
- authorAvatarUrl: z.string().url().nullish() — optional Cloudinary avatar URL
- authorAvatarPublicId: z.string().nullish() — optional Cloudinary public ID (for deletion)
- readMinutes: z.number().int().min(1).max(120).default(3) — estimated read time, 1-120 minutes, defaults to 3
- status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT') — publication state, defaults to DRAFT
- featured: z.boolean().default(false) — if true, sorts to top on list views

Auth: n/a (validation schema)

Side Effects:
Pure — no side effects.

Notes:
All LocalizedText fields require English; other locales optional (fall back to English at read time). Image fields are optional (nullish). requiredLocalizedText is a helper zod object defined in localized-text-schema.
