---
kind: 'endpoint'
name: 'AuthApi'
file: 'lib/api-client/endpoints/auth-api/auth-api.ts'
exports:
  - 'LoginCredentials'
  - 'authApi'
imports_from:
  - '@/lib/shared/types/admin-user-dto'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'app/(admin)/admin/components/admin-shell/admin-shell.tsx'
  - 'app/(admin)/admin/login/page.tsx'
auth: 'login endpoint is public; logout and me require valid session cookie'
side_effects: 'HTTP requests to /api/auth/*; set/clear httpOnly cookie server-side.'
---

# AuthApi

Purpose:
Typed axios wrappers for authentication endpoints. Used by admin login form and session checks.

Exports:

- LoginCredentials: interface — { email: string, password: string }
- authApi: object — { login, logout, me }

Imports from:

- @/lib/shared/types/admin-user-dto — AdminUserDto type
- @/lib/api-client/axios-instance — apiClient instance

Called by:

- app/(admin)/admin/(auth)/login/page.tsx (calls authApi.login on form submit)
- app/(admin)/admin/layout.tsx (calls authApi.me on load to check auth)
- Admin components (calls authApi.logout on logout button click)

Business Logic:

- login: POST /api/auth/login with { email, password } → returns AdminUserDto
- logout: POST /api/auth/logout (no body) → returns undefined
- me: GET /api/auth/me (no body) → returns AdminUserDto

Auth: login endpoint is public; logout and me require valid session cookie

Side Effects:
HTTP requests to /api/auth/\*; set/clear httpOnly cookie server-side.

Notes:
LoginCredentials input type is not imported from zod schema (only type-only import); zod parsing happens server-side. Returns are Promise<T>.then(response => response.data) to unwrap axios response envelope.
