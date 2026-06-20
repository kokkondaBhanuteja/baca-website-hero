---
kind: 'auth'
name: 'RequireAdmin'
file: 'lib/server/auth/require-admin/require-admin.ts'
exports:
  - 'requireAdmin'
imports_from:
  - '@/lib/server/http/http-error'
  - '@/lib/shared/types/admin-user-dto'
  - '@/lib/server/auth/session'
called_by:
  - 'app/api/auth/me/route.ts'
  - 'app/api/blog-articles/[id]/route.ts'
  - 'app/api/blog-articles/route.ts'
  - 'app/api/categories/[id]/route.ts'
  - 'app/api/categories/route.ts'
  - 'app/api/gallery/[id]/route.ts'
  - 'app/api/gallery/route.ts'
  - 'app/api/products/[id]/route.ts'
  - 'app/api/products/route.ts'
  - 'app/api/uploads/sign/route.ts'
auth: 'n/a (this IS the auth check)'
side_effects: 'Reads session cookie; queries Prisma for admin user on each call (to verify still exists).'
---

# RequireAdmin

Purpose:
Route guard that ensures an admin is authenticated. Called at the start of every admin route handler. Throws HttpError(401) if no valid session.

Exports:

- requireAdmin(): Promise<AdminUserDto> — Returns authenticated admin or throws 401

Imports from:

- @/lib/server/http/http-error — unauthorized error factory
- @/lib/shared/types/admin-user-dto — AdminUserDto type
- @/lib/server/auth/session — getCurrentAdmin function

Called by:

- app/api/blog-articles/route.ts (admin GET/POST)
- app/api/blog-articles/[id]/route.ts (admin GET/PATCH/DELETE)
- app/api/categories/route.ts (admin GET/POST)
- app/api/categories/[id]/route.ts (admin GET/PATCH/DELETE)
- app/api/products/route.ts (admin GET/POST)
- app/api/products/[id]/route.ts (admin GET/PATCH/DELETE)
- app/api/gallery/route.ts (admin GET/POST)
- app/api/gallery/[id]/route.ts (admin DELETE)
- any other admin-only route

Business Logic:

- Calls getCurrentAdmin() to check session cookie and JWT validity
- If admin is null, throws unauthorized('Admin authentication required')
- Otherwise returns the AdminUserDto { id, email, name, role }

Auth: n/a (this IS the auth check)

Side Effects:
Reads session cookie; queries Prisma for admin user on each call (to verify still exists).

Notes:
Must be called at the start of every admin route. Throws HttpError, which is caught by handleRoute() and converted to JSON 401 response. Does not check role (all authenticated admins can access all routes currently).
