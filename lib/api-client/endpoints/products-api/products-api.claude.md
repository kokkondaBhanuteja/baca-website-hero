---
kind: 'endpoint'
name: 'ProductsApi'
file: 'lib/api-client/endpoints/products-api/products-api.ts'
exports:
  - 'productsApi'
imports_from:
  - '@/lib/shared/types/catalogue-dto'
  - '@/lib/server/validation/product-schema'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx'
  - 'app/(admin)/admin/components/product-form/product-form.tsx'
auth: 'All endpoints require valid session cookie (enforced server-side via requireAdmin)'
side_effects: 'HTTP requests to /api/products/*; DB mutations server-side.'
---

# ProductsApi

Purpose:
Typed axios wrappers for product CRUD endpoints. Used by admin products dashboard.

Exports:

- productsApi: object — { list, get, create, update, remove }

Imports from:

- @/lib/shared/types/catalogue-dto — ProductAdminDto
- @/lib/server/validation/product-schema — ProductInput (type-only import)
- @/lib/api-client/axios-instance — apiClient instance

Called by:

- app/(admin)/admin/(dashboard)/products/page.tsx (list view)
- app/(admin)/admin/(dashboard)/products/[id]/page.tsx (detail/edit view)
- app/(admin)/admin/(dashboard)/products/new/page.tsx (new product form)

Business Logic:

- list: GET /api/products → returns ProductAdminDto[]
- get: GET /api/products/:id → returns ProductAdminDto
- create: POST /api/products with ProductInput body → returns ProductAdminDto
- update: PATCH /api/products/:id with ProductInput body → returns ProductAdminDto
- remove: DELETE /api/products/:id → returns undefined

Auth: All endpoints require valid session cookie (enforced server-side via requireAdmin)

Side Effects:
HTTP requests to /api/products/\*; DB mutations server-side.

Notes:
ProductInput is type-only. Admin reads include category info (categoryId + categoryName with raw LocalizedText). Returns are filtered by category on public reads (done via category-service).
