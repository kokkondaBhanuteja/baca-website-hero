---
kind: 'http'
name: 'HandleRoute'
file: 'lib/server/http/handle-route/handle-route.ts'
exports:
  - 'handleRoute'
imports_from:
  - 'next/server'
  - 'zod'
  - '@/lib/server/http/http-error'
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
auth: 'n/a (this IS error handling middleware)'
side_effects: 'Logs unhandled errors to console; returns different HTTP statuses based on error type.'
---

# HandleRoute

Purpose:
Universal error handler for route handlers. Catches HttpError and ZodError and converts them to consistent JSON error responses. Prevents stack traces from leaking to the client.

Exports:

- handleRoute(handler: RouteHandler): RouteHandler — Wraps a route handler function with error handling

Imports from:

- next/server — NextResponse
- zod — ZodError
- @/lib/server/http/http-error — HttpError class

Called by:

- Every route handler in app/api/\* (see below)

Business Logic:

- Wraps a route handler (takes Request, RouteContext → Promise<Response>)
- Calls the handler in a try block
- If HttpError is thrown: returns NextResponse.json({ code, message, fieldErrors? }, { status: error.status })
- If ZodError is thrown: maps all validation issues to fieldErrors object (path.join('.') as key, messages as array), returns NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Validation failed', fieldErrors }, { status: 422 })
- If any other error: logs to console, returns NextResponse.json({ code: 'INTERNAL_ERROR', message: 'Something went wrong' }, { status: 500 })

Auth: n/a (this IS error handling middleware)

Side Effects:
Logs unhandled errors to console; returns different HTTP statuses based on error type.

Notes:
HttpError status is customizable (400, 401, 403, 404, 409); ZodError always becomes 422. fieldErrorsFromZod groups issues by path (e.g. 'name.en', 'email'); missing path becomes '\_root'. Prevents accidental leakage of server implementation details in 500 responses.
