---
kind: 'http'
name: 'HttpRespond'
file: 'lib/server/http/respond/respond.ts'
exports:
  - 'ok'
  - 'created'
  - 'noContent'
imports_from:
  - 'next/server'
called_by:
  - 'app/api/auth/login/route.ts'
  - 'app/api/auth/logout/route.ts'
  - 'app/api/auth/me/route.ts'
  - 'app/api/blog-articles/[id]/route.ts'
  - 'app/api/blog-articles/route.ts'
  - 'app/api/categories/[id]/route.ts'
  - 'app/api/categories/route.ts'
  - 'app/api/enquiry/route.ts'
  - 'app/api/gallery/[id]/route.ts'
  - 'app/api/gallery/route.ts'
  - 'app/api/products/[id]/route.ts'
  - 'app/api/products/route.ts'
  - 'app/api/uploads/sign/route.ts'
auth: 'n/a (response helper)'
side_effects: 'Pure — no side effects.'
---

# HttpRespond

Purpose:
Thin helper functions for returning JSON responses from route handlers. Provides semantic status codes (200 ok, 201 created, 204 noContent).

Exports:

- ok<T>(data: T): NextResponse — Returns { data } with status 200
- created<T>(data: T): NextResponse — Returns { data } with status 201
- noContent(): NextResponse — Returns empty body with status 204

Imports from:

- next/server — NextResponse

Called by:

- All route handlers in app/api/\* (at end of successful handler functions)

Business Logic:

- ok: NextResponse.json(data, { status: 200 }) — used for GET and PATCH endpoints
- created: NextResponse.json(data, { status: 201 }) — used for POST endpoints (resource created)
- noContent: NextResponse(null, { status: 204 }) — used for DELETE endpoints (no response body)

Auth: n/a (response helper)

Side Effects:
Pure — no side effects.

Notes:
Generic <T> is inferred from the data argument (e.g. ok(adminUser) infers ok<AdminUserDto>). Simple ergonomic wrappers; could be inlined but extracted for consistency.
