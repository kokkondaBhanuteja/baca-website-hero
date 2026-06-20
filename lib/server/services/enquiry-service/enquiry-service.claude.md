---
kind: 'service'
name: 'EnquiryService'
file: 'lib/server/services/enquiry-service/enquiry-service.ts'
exports:
  - 'createEnquiry'
imports_from:
  - '@/lib/server/email'
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/prisma'
  - '@/lib/server/validation/enquiry-schema'
called_by:
  - 'app/api/enquiry/route.ts'
auth: 'Public (createEnquiry — guard is the rate-limit on the route handler)'
side_effects: 'Prisma INSERT into `enquiries`; best-effort SMTP send via sendEnquiryNotification (failure logged + swallowed).'
---

# EnquiryService

Purpose:
Receives a public contact-form submission, persists it to the DB as an audit trail, and triggers an SMTP notification to the team. There is no admin-side listing or status mutation — those features were removed when the enquiry flow moved to email-only delivery.

Exports:

- `createEnquiry(input: EnquiryInput): Promise<{ id: string }>` — writes the Enquiry row, then best-effort sends an email to `ENQUIRY_NOTIFY_TO`. Returns the new row's `id`.

Imports from:

- `@/lib/server/email` — `sendEnquiryNotification` (best-effort SMTP sender).
- `@/lib/server/http/prisma-error` — `mapPrismaError` for the Prisma write try/catch.
- `@/lib/server/prisma` — Prisma client singleton.
- `@/lib/server/validation/enquiry-schema` — `EnquiryInput` (type-only import).

Called by:

- `app/api/enquiry/route.ts` — POST handler.

Business Logic:

- Normalises the input: lowercases `email`, defaults `company` / `phone` to `null` if missing, copies the rest as-is, carries `localeSent` as metadata.
- Writes the Prisma row inside a try/catch that goes through `mapPrismaError` (P2002 → 409 etc.). The DB write is the **source of truth** — its failure rejects the request.
- After the row commits, fires `sendEnquiryNotification(normalised)`. The function swallows its own errors and returns `false` (no throw), so a missing SMTP config or a transient SMTP failure never fails the form submission.
- DB enum `EnquiryStatus` defaults to `NEW` at the column level — we no longer set or read it here.

Side Effects:
Prisma INSERT into `enquiries`; outbound SMTP request via nodemailer when SMTP is configured.

Notes:
Email lowercasing prevents duplicate buyers from registering under case-variant addresses. The `Enquiry` Prisma model stays in `schema.prisma` so existing rows remain accessible (Prisma client still exposes `prisma.enquiry`); if you ever want to drop the table entirely, that's a separate destructive change.
