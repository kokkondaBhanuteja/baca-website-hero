---
kind: 'api-route'
name: 'blog-types-collection'
file: 'app/api/blog-types/route.ts'
route: '/api/blog-types'
methods: ['GET', 'POST']
auth: 'requireAdmin'
exports: ['GET', 'POST']
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/parse-admin-list-query'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/blog-type-service'
  - '@/lib/server/validation/blog-type-schema/blog-type-schema'
---

# blog-types collection route

GET (paginated admin list) + POST (create). Both `requireAdmin`. Thin: validate
with `blogTypeInputSchema` → service → `created`/`ok`.
