---
kind: 'page'
name: 'AdminLoginPage'
file: 'app/(admin)/admin/login/page.tsx'
exports:
  - 'AdminLoginPage'
imports_from:
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/auth-api'
route: '/admin/login'
auth: 'Public (unguarded)'
---

# AdminLoginPage

Route: `/admin/login`  
Kind: page (Next.js route convention file)  
Rendering: Client  
Auth: Public (unguarded)

Purpose:
Admin login form. Client component with email/password fields. Submits to authApi.login() which POSTs to /api/auth/login. On success, redirects to /admin and refreshes.

Data:

- _No external data sources_

Business Logic:

- 'use client' — client component
- Local state: email, password, error, submitting
- handleSubmit: calls authApi.login({email, password}), sets httpOnly cookie, replaces router to /admin
- On error, displays NormalizedApiError.message
- Submit button disabled while submitting

Renders:

- Form with email input, password input
- Error alert if error state
- Submit button

Notes:
This is the only unguarded admin route. (dashboard) layout guard redirects to /admin/login if not authenticated. authApi is axios instance endpoint at @/lib/api-client/endpoints/auth-api.
