---
kind: 'api-route'
name: 'CategoriesApi'
file: 'app/api/categories/route.ts'
exports:
  - 'GET'
  - 'POST'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/parse-admin-list-query'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/category-service'
  - '@/lib/server/validation/category-schema'
route: '/api/categories'
methods:
  - 'GET'
  - 'POST'
---

# CategoriesApi

Route: `/api/categories`  
Methods: GET, POST  
Envelope: via handleRoute

Purpose:
Category CRUD. GET lists all categories (admin). POST creates new category (admin).

## Per-method

### GET

- **Auth:** requireAdmin
- **Query params:** `?page=` (default 1), `?pageSize=` (default 10, cap 100), `?q=` (search). Parsed by `parseAdminListQuery`.
- **Service:** `listCategoriesForAdmin({ page, pageSize, search })` — returns `PaginatedList<ProductCategoryAdminDto>`.
- **Response:** `ok({ items, total, page, pageSize })`.
- **Errors:** 401

### POST

- **Auth:** requireAdmin
- **Validation:** categoryInputSchema — name (LocalizedDraft), description (LocalizedDraft), isPublished (boolean)
- **Service:** createCategory(input) — creates and returns category
- **Response:** created(category) — 201
- **Errors:** 400 (validation), 401

Notes:
fieldErrors for localized field errors (e.g., 'name.en').
