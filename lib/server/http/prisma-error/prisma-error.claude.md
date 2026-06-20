---
kind: 'http'
name: 'PrismaErrorMapper'
file: 'lib/server/http/prisma-error/prisma-error.ts'
exports:
  - 'mapPrismaError'
imports_from:
  - '@prisma/client'
  - '@/lib/server/http/http-error'
called_by:
  - 'lib/server/services/blog-article-service/blog-article-service.ts'
  - 'lib/server/services/category-service/category-service.ts'
  - 'lib/server/services/enquiry-service/enquiry-service.ts'
  - 'lib/server/services/gallery-service/gallery-service.ts'
  - 'lib/server/services/product-service/product-service.ts'
auth: 'n/a (error mapper)'
side_effects: 'Pure — no side effects.'
---

# PrismaErrorMapper

Purpose:
Translates Prisma-level errors to HttpError with appropriate status codes. Called in try/catch blocks of service write operations.

Exports:

- mapPrismaError(error: unknown): never — Throws an HttpError based on Prisma error code

Imports from:

- @prisma/client — Prisma namespace for error checking
- @/lib/server/http/http-error — badRequest, conflictError, notFoundError helpers

Called by:

- All service create/update/delete functions (e.g., category-service, product-service, blog-article-service, gallery-service, enquiry-service) in catch blocks

Business Logic:

- Checks if error is instanceof Prisma.PrismaClientKnownRequestError
- If code is 'P2002' (unique constraint violation, e.g. slug already exists): throws conflictError('That slug is already in use')
- If code is 'P2003' (foreign key constraint violation, e.g. referenced record doesn't exist): throws badRequest('Referenced record does not exist')
- If code is 'P2025' (record not found on update/delete): throws notFoundError('Record not found')
- If error is not a known Prisma error, re-throws the original error (let it bubble to handleRoute as unhandled 500)

Auth: n/a (error mapper)

Side Effects:
Pure — no side effects.

Notes:
Never returns (always throws). Pattern: `try { … } catch (error) { throw mapPrismaError(error) }` or `catch (error) { return mapPrismaError(error) }` (if function returns never). P2002 is most common (slug conflicts). P2003 occurs if admin tries to assign product to non-existent category. P2025 is less common (record already deleted).
