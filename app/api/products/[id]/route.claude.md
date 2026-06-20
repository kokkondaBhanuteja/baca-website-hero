---
kind: 'api-route'
name: 'ProductDetailApi'
file: 'app/api/products/[id]/route.ts'
exports:
  - 'GET'
  - 'PATCH'
  - 'DELETE'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/product-service'
  - '@/lib/server/validation/product-schema'
route: '/api/products/[id]'
methods:
  - 'GET'
  - 'PATCH'
  - 'DELETE'
---

# ProductDetailApi

Route: `/api/products/[id]`  
Methods: GET, PATCH, DELETE  
Envelope: via handleRoute

Purpose:
Single product operations. GET fetches product. PATCH updates. DELETE removes.

## Per-method

### GET

- **Auth:** requireAdmin
- **Validation:** None (no body); params.id required
- **Service:** getProductForAdmin(id) — returns single product with all locales
- **Response:** ok(product)
- **Errors:** 401 (not admin), 404 (product not found)

### PATCH

- **Auth:** requireAdmin
- **Validation:** productInputSchema (same as POST)
- **Service:** updateProduct(id, input) — updates and returns product
- **Response:** ok(product)
- **Errors:** 400 (validation), 401 (not admin), 404 (not found)

### DELETE

- **Auth:** requireAdmin
- **Validation:** None (no body)
- **Service:** deleteProduct(id) — soft or hard delete
- **Response:** noContent() — 204
- **Errors:** 401 (not admin), 404 (not found)

Notes:
All responses wrapped by handleRoute error handler.
