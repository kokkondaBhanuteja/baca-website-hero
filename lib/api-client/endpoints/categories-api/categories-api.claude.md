---
kind: 'endpoint'
name: 'CategoriesApi'
file: 'lib/api-client/endpoints/categories-api/categories-api.ts'
exports:
  - 'categoriesApi'
imports_from:
  - '@/lib/shared/types/catalogue-dto'
  - '@/lib/server/validation/category-schema'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'app/(admin)/admin/components/category-form/category-form.tsx'
  - 'app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx'
auth: 'All endpoints require valid session cookie (enforced server-side via requireAdmin)'
side_effects: 'HTTP requests to /api/categories/*; DB mutations server-side.'
---

# CategoriesApi

Purpose:
Typed axios wrappers for category CRUD endpoints. Used by admin categories dashboard.

Exports:

- categoriesApi: object — { list, get, create, update, remove }

Imports from:

- @/lib/shared/types/catalogue-dto — ProductCategoryAdminDto
- @/lib/server/validation/category-schema — CategoryInput (type-only import)
- @/lib/api-client/axios-instance — apiClient instance

Called by:

- app/(admin)/admin/(dashboard)/categories/page.tsx (list view)
- app/(admin)/admin/(dashboard)/categories/[id]/page.tsx (detail/edit view)
- app/(admin)/admin/(dashboard)/categories/new/page.tsx (new category form)

Business Logic:

- list: GET /api/categories → returns ProductCategoryAdminDto[]
- get: GET /api/categories/:id → returns ProductCategoryAdminDto
- create: POST /api/categories with CategoryInput body → returns ProductCategoryAdminDto
- update: PATCH /api/categories/:id with CategoryInput body → returns ProductCategoryAdminDto
- remove: DELETE /api/categories/:id → returns undefined

Auth: All endpoints require valid session cookie (enforced server-side via requireAdmin)

Side Effects:
HTTP requests to /api/categories/\*; DB mutations server-side.

Notes:
CategoryInput is type-only. Admin reads include raw LocalizedText for edit forms. Returns include productCount (computed via \_count in service).
