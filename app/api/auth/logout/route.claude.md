---
kind: 'api-route'
name: 'AuthLogoutApi'
file: 'app/api/auth/logout/route.ts'
exports:
  - 'POST'
imports_from:
  - '@/lib/server/auth/session'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
route: '/api/auth/logout'
methods:
  - 'POST'
---

# AuthLogoutApi

Route: `/api/auth/logout`  
Methods: POST  
Envelope: via handleRoute

Purpose:
Admin logout endpoint. Deletes session cookie.

## Per-method

### POST

- **Auth:** Public
- **Validation:** None (no body)
- **Service:** None — just deletes cookie
- **Response:** noContent() — 204
- **Errors:** None

Notes:
No authentication check (anyone can call). Simply deletes SESSION_COOKIE_NAME.
