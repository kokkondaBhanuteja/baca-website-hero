---
kind: 'api-route'
name: 'blog-types-item'
file: 'app/api/blog-types/[id]/route.ts'
route: '/api/blog-types/[id]'
methods: ['GET', 'PATCH', 'DELETE']
auth: 'requireAdmin'
exports: ['GET', 'PATCH', 'DELETE']
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/blog-type-service'
  - '@/lib/server/validation/blog-type-schema/blog-type-schema'
---

# blog-types item route

GET / PATCH / DELETE by id, all `requireAdmin`. DELETE surfaces a conflict when
the type still has articles (service guard + `onDelete: Restrict`).
