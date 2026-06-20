---
kind: 'api-route'
name: 'BlogArticleDetailApi'
file: 'app/api/blog-articles/[id]/route.ts'
exports:
  - 'GET'
  - 'PATCH'
  - 'DELETE'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/server/validation/blog-article-schema'
route: '/api/blog-articles/[id]'
methods:
  - 'GET'
  - 'PATCH'
  - 'DELETE'
---

# BlogArticleDetailApi

Route: `/api/blog-articles/[id]`  
Methods: GET, PATCH, DELETE  
Envelope: via handleRoute

Purpose:
Single blog article operations.

## Per-method

### GET

- **Auth:** requireAdmin
- **Validation:** None
- **Service:** getArticleForAdmin(id)
- **Response:** ok(article)
- **Errors:** 401, 404

### PATCH

- **Auth:** requireAdmin
- **Validation:** blogArticleInputSchema
- **Service:** updateArticle(id, input)
- **Response:** ok(article)
- **Errors:** 400, 401, 404

### DELETE

- **Auth:** requireAdmin
- **Validation:** None
- **Service:** deleteArticle(id)
- **Response:** noContent() — 204
- **Errors:** 401, 404

Notes:
Same pattern as other CRUD endpoints.
