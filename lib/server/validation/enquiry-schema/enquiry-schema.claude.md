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
- `country`: trimmed, **required**, 1–80 chars. Used only at notification time (included in the email body so the BACA team knows the buyer's origin before replying) — NOT persisted to the DB since the Enquiry table was removed when the flow became email-only.
- `message`: trimmed, 1–200 chars. The 200-char cap is enforced both client-side (textarea `maxLength` + visible counter) and server-side (this schema) so a tampered client can't bypass it.
- `localeSent`: trimmed, 2–5 chars (locale code, not validated against the project's `LOCALES` tuple — stored as metadata).

Notes:
Email validation uses a regex rather than `z.email()` to accept the long tail of unusual-but-valid addresses (apostrophes, plus tags, etc.). The schema rejects empty `name` and `message` with explicit messages that surface as `fieldErrors` in the form UI.
