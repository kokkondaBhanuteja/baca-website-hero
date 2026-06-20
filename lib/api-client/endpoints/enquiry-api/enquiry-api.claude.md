---
kind: 'endpoint'
name: 'EnquiryApi'
file: 'lib/api-client/endpoints/enquiry-api/enquiry-api.ts'
exports:
  - 'enquiryApi'
imports_from:
  - '@/lib/server/validation/enquiry-schema'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'components/sections/contact/enquiry-form/enquiry-form.tsx'
auth: 'submit is public.'
side_effects: 'HTTP POST to /api/enquiry; server-side DB write + best-effort SMTP send.'
---

# EnquiryApi

Purpose:
Typed axios wrapper for the public enquiry submission. Only `submit` exists — there is no admin list / updateStatus client (the admin enquiry UI was removed when the flow moved to email-only delivery).

Exports:

- `enquiryApi: { submit }` — `submit(input: EnquiryInput) => Promise<{ id: string }>`.

Imports from:

- `@/lib/server/validation/enquiry-schema` — `EnquiryInput` (type-only).
- `@/lib/api-client/axios-instance` — global axios instance.

Called by:

- `components/sections/contact/enquiry-form/enquiry-form.tsx` — public form on `/contact`.

Notes:
Type-only import of `EnquiryInput` keeps the server-only validation file out of the client bundle. The route is rate-limited server-side (5 / 10 min per IP).
