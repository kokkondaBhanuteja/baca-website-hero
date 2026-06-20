---
kind: 'schema'
name: 'EnquirySchema'
file: 'lib/server/validation/enquiry-schema/enquiry-schema.ts'
exports:
  - 'enquiryInputSchema'
  - 'EnquiryInput'
  - 'enquiryStatusSchema'
imports_from:
  - 'zod'
called_by:
  - 'app/api/enquiry/[id]/route.ts'
  - 'app/api/enquiry/route.ts'
  - 'lib/api-client/endpoints/enquiry-api/enquiry-api.ts'
  - 'lib/server/services/enquiry-service/enquiry-service.ts'
auth: 'n/a (validation schema)'
side_effects: 'Pure — no side effects.'
---

# EnquirySchema

Purpose:
Zod schema for contact-form submissions (public) and admin status updates. Validates contact info, message, and enquiry status.

Exports:

- enquiryInputSchema: z.object — Public form submission validation
- EnquiryInput: type — Inferred type from enquiryInputSchema
- enquiryStatusSchema: z.object — Admin status-update validation

Imports from:

- zod — z object builder

Called by:

- app/api/enquiry/route.ts (public POST, admin PATCH body validation)

Business Logic:

- name: z.string().trim().min(1, 'Name is required').max(120) — contact name, 1-120 chars
- email: custom validation — trimmed, 1-200 chars, regex pattern match for basic email format (not strict RFC)
- company: z.string().trim().max(160).nullish() — optional company name, max 160 chars
- phone: z.string().trim().max(40).nullish() — optional phone, max 40 chars
- message: z.string().trim().min(1, 'Message is required').max(4000) — required message, 1-4000 chars
- localeSent: z.string().trim().min(2).max(5) — locale code (e.g. 'en', 'de', 'ar'), 2-5 chars (metadata)
- status: z.enum(['NEW', 'READ', 'ARCHIVED']) — admin status; only in enquiryStatusSchema (not in creation)

Auth: n/a (validation schema)

Side Effects:
Pure — no side effects.

Notes:
enquiryInputSchema is for public submissions (no status field); enquiryStatusSchema is for admin PATCH updates (only status field). Email validation uses regex pattern (not z.email()) because .email() is too strict for some valid addresses. localeSent is not validated against a locale list; it's just stored as-is (metadata for which form the user submitted from).
