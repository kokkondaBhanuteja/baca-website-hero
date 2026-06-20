---
kind: 'schema'
name: 'EnquirySchema'
file: 'lib/server/validation/enquiry-schema/enquiry-schema.ts'
exports:
  - 'enquiryInputSchema'
  - 'EnquiryInput'
imports_from:
  - 'zod'
called_by:
  - 'app/api/enquiry/route.ts'
  - 'lib/api-client/endpoints/enquiry-api/enquiry-api.ts'
  - 'lib/server/services/enquiry-service/enquiry-service.ts'
auth: 'n/a (validation schema)'
side_effects: 'Pure — no side effects.'
---

# EnquirySchema

Purpose:
Zod schema for the public contact-form submission. Validates contact info, message, and the originating locale.

Exports:

- `enquiryInputSchema: z.object` — public POST body validation.
- `EnquiryInput: type` — `z.infer<typeof enquiryInputSchema>`.

Called by:

- `app/api/enquiry/route.ts` — POST body validation.
- `lib/api-client/endpoints/enquiry-api/enquiry-api.ts` — type-only import of `EnquiryInput`.
- `lib/server/services/enquiry-service/enquiry-service.ts` — type-only import of `EnquiryInput`.

Business Logic:

- `name`: trimmed, 1–120 chars.
- `email`: trimmed, 1–200 chars, regex format match (not RFC-strict).
- `company`: trimmed, max 160 chars, nullish (optional).
- `phone`: trimmed, max 40 chars, nullish (optional).
- `message`: trimmed, 1–4000 chars.
- `localeSent`: trimmed, 2–5 chars (locale code, not validated against the project's `LOCALES` tuple — stored as metadata).

Notes:
Email validation uses a regex rather than `z.email()` to accept the long tail of unusual-but-valid addresses (apostrophes, plus tags, etc.). The schema rejects empty `name` and `message` with explicit messages that surface as `fieldErrors` in the form UI.
