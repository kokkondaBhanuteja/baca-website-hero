---
kind: 'endpoint'
name: 'BlogArticlesApi'
file: 'lib/api-client/endpoints/blog-articles-api/blog-articles-api.ts'
exports:
  - 'blogArticlesApi'
imports_from:
  - '@/lib/shared/types/blog-dto'
  - '@/lib/server/validation/blog-article-schema'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'app/(admin)/admin/components/blog-article-form/blog-article-form.tsx'
  - 'app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx'
auth: 'All endpoints require valid session cookie (enforced server-side via requireAdmin)'
side_effects: 'HTTP requests to /api/blog-articles/*; DB mutations server-side.'
---

# BlogArticlesApi

Purpose:
Typed axios wrappers for blog article CRUD endpoints. Used by admin blog dashboard.

Exports:

- blogArticlesApi: object — { list, get, create, update, remove }

Imports from:

- @/lib/shared/types/blog-dto — BlogArticleAdminDto
- @/lib/server/validation/blog-article-schema — BlogArticleInput (type-only import)
- @/lib/api-client/axios-instance — apiClient instance

Called by:

- app/(admin)/admin/(dashboard)/blog-articles/page.tsx (list view)
- app/(admin)/admin/(dashboard)/blog-articles/[id]/page.tsx (detail/edit view)
- app/(admin)/admin/(dashboard)/blog-articles/new/page.tsx (new article form)

Business Logic:

- list: GET /api/blog-articles → returns BlogArticleAdminDto[]
- get: GET /api/blog-articles/:id → returns BlogArticleAdminDto
- create: POST /api/blog-articles with BlogArticleInput body → returns BlogArticleAdminDto
- update: PATCH /api/blog-articles/:id with BlogArticleInput body → returns BlogArticleAdminDto
- remove: DELETE /api/blog-articles/:id → returns undefined

Auth: All endpoints require valid session cookie (enforced server-side via requireAdmin)

Side Effects:
HTTP requests to /api/blog-articles/\*; DB mutations server-side.

Notes:
BlogArticleInput is type-only (never imported at runtime) so no server module is bundled. Admin reads include raw LocalizedText objects (for edit forms). HTTP status codes: 200 ok, 201 created, 204 noContent; errors normalize to NormalizedApiError.
