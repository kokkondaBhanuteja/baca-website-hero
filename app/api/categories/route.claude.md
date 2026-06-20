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
- **Validation:** None
- **Service:** listCategoriesForAdmin() — returns all categories with all locales
- **Response:** ok(categories)
- **Errors:** 401

### POST

- **Auth:** requireAdmin
- **Validation:** categoryInputSchema — name (LocalizedDraft), description (LocalizedDraft), isPublished (boolean)
- **Service:** createCategory(input) — creates and returns category
- **Response:** created(category) — 201
- **Errors:** 400 (validation), 401

Notes:
fieldErrors for localized field errors (e.g., 'name.en').
