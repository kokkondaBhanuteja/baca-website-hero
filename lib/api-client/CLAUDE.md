# lib/api-client/ — Global axios (CLIENT-ONLY)

The browser-side API layer. `axios-instance.ts` starts with `import 'client-only'` → importing it from a
Server Component is a build error. **Used by admin Client Components** and the public contact form's POST.
Other public pages never use this — they read via `lib/server/services/*` directly.

```
axios-instance.ts    The single global instance: apiClient = axios.create({
                       baseURL: '/api', timeout 15s, withCredentials (sends the httpOnly session cookie),
                       allowAbsoluteUrls: false })
                     Response interceptor: 401 → redirect to /admin/login; errors normalized to
                     NormalizedApiError { code, message, fieldErrors? }.
endpoints/           Typed wrappers (one object per entity). Each method returns response.data:
  auth-api · products-api · categories-api · blog-articles-api · gallery-api · uploads-api · enquiry-api · enquiry-api
```

## Conventions

- Input types come from the zod schemas via `import type { ProductInput } from '@/lib/server/validation/…'`
  (**type-only import** — erased at compile, so it doesn't pull the server module at runtime). DTOs come from
  `@/lib/shared/types/*`.
- Forms catch the rejected `NormalizedApiError` and surface `.message` + `.fieldErrors` (keyed by field path,
  e.g. `name.en`).
- **Cloudinary upload bypasses this instance on purpose**: the uploader gets a signature from
  `POST /api/uploads/sign` (via `uploads-api`), then uploads the file **directly to `api.cloudinary.com`** with a
  bare `fetch` (keeps image bytes off our server).
- axios is pinned to an exact version — don't widen it to a caret range.
