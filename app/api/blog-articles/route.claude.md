---
kind: 'api-route'
name: 'BlogArticlesApi'
file: 'app/api/blog-articles/route.ts'
exports:
  - 'GET'
  - 'POST'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/parse-admin-list-query'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/server/validation/blog-article-schema'
route: '/api/blog-articles'
methods:
  - 'GET'
  - 'POST'
---

# BlogArticlesApi

Route: `/api/blog-articles`  
Methods: GET, POST  
Envelope: via handleRoute

Purpose:
Blog article CRUD. GET lists all articles (admin). POST creates new article (admin).

## Per-method

### GET

- **Auth:** requireAdmin
- **Query params:** `?page=` (default 1), `?pageSize=` (default 10, cap 100), `?q=` (search). Parsed by `parseAdminListQuery`.
- **Service:** `listArticlesForAdmin({ page, pageSize, search })` — returns `PaginatedList<BlogArticleAdminDto>`.
- **Response:** `ok({ items, total, page, pageSize })`.
- **Errors:** 401

### POST

- **Auth:** requireAdmin
- **Validation:** blogArticleInputSchema — title (LocalizedDraft), excerpt (LocalizedDraft), body (LocalizedDraft), category (enum), featured (boolean), status (PUBLISHED/DRAFT), coverImageUrl (string)
- **Service:** createArticle(input)
- **Response:** created(article) — 201
- **Errors:** 400, 401

Notes:
body is plain markdown/text per locale. readMinutes calculated server-side.
