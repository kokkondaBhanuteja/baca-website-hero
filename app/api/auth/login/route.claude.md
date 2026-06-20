---
kind: 'api-route'
name: 'AuthLoginApi'
file: 'app/api/auth/login/route.ts'
exports:
  - 'POST'
imports_from:
  - '@/lib/server/auth/jwt'
  - '@/lib/server/auth/session'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/admin-user-service'
  - '@/lib/server/validation/auth-schema'
route: '/api/auth/login'
methods:
  - 'POST'
---

# AuthLoginApi

Route: `/api/auth/login`  
Methods: POST  
Envelope: via handleRoute — { data: admin } on success, { code, message } on error

Purpose:
Admin login endpoint. Validates email/password, authenticates admin user, signs JWT token, and sets httpOnly session cookie.

## Per-method

### POST

- **Auth:** Public
- **Validation:** loginSchema (email: string, password: string)
- **Service:** authenticateAdmin(email, password) — validates credentials, throws HttpError 401 if invalid
- **Response:** ok(admin) — returns admin object with id, role
- **Errors:** 400 (validation error), 401 (invalid credentials)

Notes:
Sets httpOnly cookie SESSION_COOKIE_NAME with maxAge SESSION_MAX_AGE_SECONDS. Cookie secure: true in production only. sameSite: lax. Token signed via signSessionToken({ adminId, role }).
