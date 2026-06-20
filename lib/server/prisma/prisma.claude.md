---
kind: 'prisma-client'
name: 'PrismaClient'
file: 'lib/server/prisma/prisma.ts'
exports:
  - 'prisma'
imports_from:
  - '@prisma/client'
called_by:
  - 'app/(admin)/admin/(dashboard)/page.tsx'
  - 'lib/server/auth/session/session.ts'
  - 'lib/server/services/admin-user-service/admin-user-service.ts'
  - 'lib/server/services/blog-article-service/blog-article-service.ts'
  - 'lib/server/services/category-service/category-service.ts'
  - 'lib/server/services/enquiry-service/enquiry-service.ts'
  - 'lib/server/services/gallery-service/gallery-service.ts'
  - 'lib/server/services/product-service/product-service.ts'
auth: 'n/a (database client)'
side_effects: 'Creates a database connection pool on import; queries are executed by callers.'
---

# PrismaClient

Purpose:
Singleton PrismaClient reused across hot reloads in development to avoid exhausting the database connection pool.

Exports:

- prisma: PrismaClient — Singleton instance, stored globally in dev

Imports from:

- @prisma/client — PrismaClient

Called by:

- Every service function in lib/server/services/\* (all DB operations go through this instance)
- lib/server/auth/session — getCurrentAdmin queries prisma.adminUser

Business Logic:

- Declares a global variable globalForPrisma to store the PrismaClient
- On import: creates or reuses existing PrismaClient (if NODE_ENV !== 'production')
- Sets logging: in dev mode, logs 'warn' and 'error'; in production, only 'error'
- Stores the instance globally in dev so hot reloads don't create new connections

Auth: n/a (database client)

Side Effects:
Creates a database connection pool on import; queries are executed by callers.

Notes:
Global storage is only in development (NODE_ENV !== 'production'). In production, each lambda/request gets its own instance (stateless). PrismaClient is configured via DATABASE_URL (Neon cloud DB in dev). Prisma schema is in prisma/schema.prisma.
