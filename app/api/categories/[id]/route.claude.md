---
kind: 'api-route'
name: 'CategoryDetailApi'
file: 'app/api/categories/[id]/route.ts'
exports:
  - 'GET'
  - 'PATCH'
  - 'DELETE'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/category-service'
  - '@/lib/server/validation/category-schema'
route: '/api/categories/[id]'
methods:
  - 'GET'
  - 'PATCH'
  - 'DELETE'
---

# CategoryDetailApi

Route: `/api/categories/[id]`  
Methods: GET, PATCH, DELETE  
Envelope: via handleRoute

Purpose:
Single category operations.

## Per-method

### GET

- **Auth:** requireAdmin
- **Validation:** None
- **Service:** getCategoryForAdmin(id)
- **Response:** ok(category)
- **Errors:** 401, 404

### PATCH

- **Auth:** requireAdmin
- **Validation:** categoryInputSchema
- **Service:** updateCategory(id, input)
- **Response:** ok(category)
- **Errors:** 400, 401, 404

### DELETE

- **Auth:** requireAdmin
- **Validation:** None
- **Service:** deleteCategory(id)
- **Response:** noContent() — 204
- **Errors:** 401, 404

Notes:
Same pattern as products.
