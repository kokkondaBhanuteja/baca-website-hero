---
kind: 'service'
name: 'EnquiryService'
file: 'lib/server/services/enquiry-service/enquiry-service.ts'
exports:
  - 'createEnquiry'
imports_from:
  - '@/lib/server/email'
  - '@/lib/server/http/http-error'
  - '@/lib/server/validation/enquiry-schema'
called_by:
  - 'app/api/enquiry/route.ts'
auth: 'Public (createEnquiry — guard is the rate-limit on the route handler)'
side_effects: 'SMTP send via sendEnquiryNotification. No DB writes — the Enquiry table was removed when the flow became email-only.'
---

# EnquiryService

Purpose:
Receives a public contact-form submission and forwards it to the BACA team via
SMTP. Email-only — there is no DB persistence. The previous `enquiries` table

- `EnquiryStatus` enum were removed once SMTP became the sole notification
  path; if SMTP is misconfigured or the send fails, the submission is lost and
  the caller is told so (503).

Exports:

- `createEnquiry(input: EnquiryInput): Promise<void>` — assembles the email
  payload (lowercasing the address, defaulting nullable fields), calls
  `sendEnquiryNotification`, throws `HttpError(503, 'EMAIL_SEND_FAILED', …)` if
  the send returns `false`. Returns `void` on success — there is no row id to
  hand back.

Imports from:

- `@/lib/server/email` — `sendEnquiryNotification` (SMTP sender, returns boolean).
- `@/lib/server/http/http-error` — `HttpError` for the 503 path.
- `@/lib/server/validation/enquiry-schema` — `EnquiryInput` (type-only import).

Called by:

- `app/api/enquiry/route.ts` — POST handler (rate-limited, zod-validated).

Business Logic:

- Builds the email payload: lowercases `email`, defaults `company` / `phone` to
  `null` if empty, copies the required `name`, `country`, `message`, and
  `localeSent` (carried as send metadata).
- Awaits `sendEnquiryNotification(payload)`. The email module swallows its own
  internal exceptions and returns `false` on any failure (missing SMTP config,
  network error, auth reject). If `false`, the service throws a 503 so the
  form shows a clear error instead of silently dropping the enquiry.

Side Effects:

- One outbound SMTP request per call when SMTP is configured.
- No DB writes — the `enquiries` table no longer exists in the schema.

Notes:

- Trade-off vs. the prior design: lost the audit trail (no row to show in an
  admin inbox), gained simplicity (no DB drift, one notification path). If
  enquiries ever need to be reviewable in the admin, restore the model + the
  insert here.
- The Neon DB may still contain the orphan `enquiries` table physically — the
  schema removal makes it unreachable from this codebase. Drop it via the Neon
  console when convenient.
