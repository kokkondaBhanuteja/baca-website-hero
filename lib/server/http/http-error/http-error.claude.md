---
kind: 'http'
name: 'HttpError'
file: 'lib/server/http/http-error/http-error.ts'
exports:
  - 'HttpError'
  - 'badRequest'
  - 'unauthorized'
  - 'forbidden'
  - 'notFoundError'
  - 'conflictError'
imports_from:
  - '(no'
called_by:
  - 'app/(admin)/admin/(dashboard)/blog-articles/[id]/page.tsx'
  - 'app/(admin)/admin/(dashboard)/categories/[id]/page.tsx'
  - 'app/(admin)/admin/(dashboard)/products/[id]/page.tsx'
  - 'app/api/auth/login/route.ts'
  - 'lib/server/auth/require-admin/require-admin.ts'
  - 'lib/server/cloudinary/sign-upload/sign-upload.ts'
  - 'lib/server/http/handle-route/handle-route.ts'
  - 'lib/server/http/prisma-error/prisma-error.ts'
  - 'lib/server/services/admin-user-service/admin-user-service.ts'
  - 'lib/server/services/blog-article-service/blog-article-service.ts'
  - 'lib/server/services/category-service/category-service.ts'
  - 'lib/server/services/gallery-service/gallery-service.ts'
  - 'lib/server/services/product-service/product-service.ts'
auth: 'n/a (error class, not auth logic)'
side_effects: 'Pure — no side effects.'
---

# HttpError

Purpose:
Domain error class for all HTTP-level exceptions in services and route handlers. Carries status code, machine-readable code, user message, and optional field-level errors.

Exports:

- HttpError: class — constructor(status: number, code: string, message: string, fieldErrors?: Record<string, string[]>)
- badRequest(message?): HttpError — 400 BAD_REQUEST
- unauthorized(message?): HttpError — 401 UNAUTHORIZED
- forbidden(message?): HttpError — 403 FORBIDDEN
- notFoundError(message?): HttpError — 404 NOT_FOUND
- conflictError(message?): HttpError — 409 CONFLICT

Imports from:

- (no imports)

Called by:

- All service functions (e.g., authenticateAdmin throws unauthorized, deleteCategory throws conflictError)
- All route handlers (via requireAdmin, service logic, or explicit checks)

Business Logic:

- HttpError is an Error subclass with public readonly properties: status, code, message, fieldErrors
- Helpers create HttpError instances with common status codes and machine-readable codes
- badRequest: status 400, code 'BAD_REQUEST'
- unauthorized: status 401, code 'UNAUTHORIZED'
- forbidden: status 403, code 'FORBIDDEN'
- notFoundError: status 404, code 'NOT_FOUND'
- conflictError: status 409, code 'CONFLICT'
- fieldErrors is optional and used for validation errors that point to specific form fields

Auth: n/a (error class, not auth logic)

Side Effects:
Pure — no side effects.

Notes:
Code field is machine-readable; message is user-facing (both included in JSON response). Used throughout services to signal domain errors; handleRoute() catches and converts to NextResponse. fieldErrors is a Record<field, messages[]> for form validation feedback.
