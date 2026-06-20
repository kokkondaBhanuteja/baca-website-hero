---
kind: 'api-route'
name: 'AuthMeApi'
file: 'app/api/auth/me/route.ts'
exports:
  - 'GET'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
route: '/api/auth/me'
methods:
  - 'GET'
---

# AuthMeApi

Route: `/api/auth/me`  
Methods: GET  
Envelope: via handleRoute

Purpose:
Get current admin session. Returns authenticated admin or 401 if no valid session.

## Per-method

### GET

- **Auth:** requireAdmin
- **Validation:** None (no body)
- **Service:** requireAdmin() — checks session cookie, throws HttpError 401 if invalid
- **Response:** ok(admin) — returns admin object with id, role
- **Errors:** 401 (no session or invalid token)

Notes:
Used by client to verify login status or restore session after page refresh.
