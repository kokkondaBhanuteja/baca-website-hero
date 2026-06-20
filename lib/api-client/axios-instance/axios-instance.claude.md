---
kind: 'axios-client'
name: 'AxiosInstance'
file: 'lib/api-client/axios-instance/axios-instance.ts'
exports:
  - 'apiClient'
  - 'NormalizedApiError'
imports_from:
  - 'axios'
  - '(no'
called_by:
  - 'app/(admin)/admin/components/blog-article-form/blog-article-form.tsx'
  - 'app/(admin)/admin/components/category-form/category-form.tsx'
  - 'app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx'
  - 'app/(admin)/admin/components/gallery-uploader-form/gallery-uploader-form.tsx'
  - 'app/(admin)/admin/components/image-uploader/image-uploader.tsx'
  - 'app/(admin)/admin/components/product-form/product-form.tsx'
  - 'app/(admin)/admin/login/page.tsx'
  - 'components/sections/contact/enquiry-form/enquiry-form.tsx'
  - 'lib/api-client/endpoints/auth-api/auth-api.ts'
  - 'lib/api-client/endpoints/blog-articles-api/blog-articles-api.ts'
  - 'lib/api-client/endpoints/categories-api/categories-api.ts'
  - 'lib/api-client/endpoints/enquiry-api/enquiry-api.ts'
  - 'lib/api-client/endpoints/gallery-api/gallery-api.ts'
  - 'lib/api-client/endpoints/products-api/products-api.ts'
  - 'lib/api-client/endpoints/uploads-api/uploads-api.ts'
auth: 'n/a (client HTTP layer; auth is server-side via cookie)'
side_effects: 'Sets up interceptor on import; may redirect browser to login on 401.'
---

# AxiosInstance

Purpose:
Single global axios instance for all client-side API calls. Same-origin, sends httpOnly session cookie, handles 401 redirects, and normalizes errors to NormalizedApiError.

Exports:

- apiClient: AxiosInstance — Configured axios instance with interceptors
- NormalizedApiError: interface — { code: string, message: string, fieldErrors?: Record<string, string[]> }

Imports from:

- axios — axios, AxiosError
- (no auth/env imports — this is client-only)

Called by:

- All lib/api-client/endpoints/\* (every API call routes through this instance)
- Any admin Client Component making manual API calls

Business Logic:

- Creates axios instance with baseURL: '/api' (same-origin), timeout 15s, withCredentials: true (sends httpOnly cookie), allowAbsoluteUrls: false (prevents SSRF), default Content-Type: 'application/json'
- Response interceptor catches all errors (AxiosError<ApiErrorBody>)
- If status is 401 and not already on /admin/login: redirects window.location.assign('/admin/login') (auto-logout on session expiry)
- Normalizes error response to NormalizedApiError { code, message, fieldErrors? } (or NETWORK_ERROR if body is missing)
- Returns Promise.reject(normalized) so all callers see consistent error shape

Auth: n/a (client HTTP layer; auth is server-side via cookie)

Side Effects:
Sets up interceptor on import; may redirect browser to login on 401.

Notes:
withCredentials: true allows the httpOnly session cookie to be sent with cross-origin requests (if CORS allows); same-origin API so not a concern. 401 redirect bypasses /admin/login (prevents redirect loop). Error normalization means all API errors have code + message + fieldErrors.
