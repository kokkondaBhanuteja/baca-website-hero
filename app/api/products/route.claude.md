---
kind: 'api-route'
name: 'ProductsApi'
file: 'app/api/products/route.ts'
exports:
  - 'GET'
  - 'POST'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/parse-admin-list-query'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/product-service'
  - '@/lib/server/validation/product-schema'
route: '/api/products'
methods:
  - 'GET'
  - 'POST'
---

# ProductsApi

Route: `/api/products`  
Methods: GET, POST  
Envelope: via handleRoute — { data: ... } success, { code, message, fieldErrors? } error

Purpose:
Product CRUD. GET lists all products (admin). POST creates a new product (admin).

## Per-method

### GET

- **Auth:** requireAdmin
- **Query params:** `?page=` (default 1), `?pageSize=` (default 10, capped at 100), `?q=` (search). Parsed by `parseAdminListQuery`.
- **Service:** `listProductsForAdmin({ page, pageSize, search })` — returns `PaginatedList<ProductAdminDto>` ({ items, total, page, pageSize }).
- **Response:** `ok({ items, total, page, pageSize })`.
- **Errors:** 401 (not admin)

### POST

- **Auth:** requireAdmin
- **Validation:** productInputSchema — name (LocalizedDraft), summary (LocalizedDraft), description (LocalizedDraft), categoryId (string), imageUrl (string), isPublished (boolean)
- **Service:** createProduct(input) — creates product and returns it
- **Response:** created(product) — 201 with new product
- **Errors:** 400 (validation), 401 (not admin)

Notes:
fieldErrors in error response keyed by field (e.g., 'name.en' for validation on EN name).
