---
kind: 'service'
name: 'EnquiryService'
file: 'lib/server/services/enquiry-service/enquiry-service.ts'
exports:
  - 'createEnquiry'
  - 'listEnquiries'
  - 'countNewEnquiries'
  - 'updateEnquiryStatus'
imports_from:
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/prisma'
  - '@/lib/shared/types/enquiry-dto'
  - '@/lib/server/validation/enquiry-schema'
called_by:
  - 'app/(admin)/admin/(dashboard)/enquiries/page.tsx'
  - 'app/api/enquiry/[id]/route.ts'
  - 'app/api/enquiry/route.ts'
auth: 'createEnquiry: public (no guard); listEnquiries/countNewEnquiries/updateEnquiryStatus: requireAdmin internally'
side_effects: 'DB writes (CREATE, UPDATE); timestamps auto-set by Prisma.'
---

# EnquiryService

Purpose:
Handles public contact-form submissions and admin enquiry inbox. Tracks enquiry status (NEW, READ, ARCHIVED) and localization context of submission.

Exports:

- createEnquiry(input: EnquiryInput): Promise<{ id: string }> — Public submission; returns ID
- listEnquiries(): Promise<EnquiryDto[]> — Admin inbox, newest first
- countNewEnquiries(): Promise<number> — Count unread enquiries (for admin dashboard badge)
- updateEnquiryStatus(id: string, status: EnquiryStatusValue): Promise<EnquiryDto> — Admin status update; wraps mapPrismaError

Imports from:

- @/lib/server/http/prisma-error — mapPrismaError
- @/lib/server/prisma — PrismaClient
- @/lib/shared/types/enquiry-dto — EnquiryDto, EnquiryStatusValue
- @/lib/server/validation/enquiry-schema — EnquiryInput type

Called by:

- app/api/enquiry/route.ts (public POST, admin GET, admin PATCH)
- app/(site)/[locale]/contact/page.tsx (client-side submit, public)

Business Logic:

- createEnquiry: normalizes email to lowercase, stores name/email/company/phone/message as-is, captures localeSent (locale of the form at submission time), creates row with status='NEW'
- listEnquiries: fetches all enquiries ordered by createdAt DESC (newest first), maps rows to EnquiryDto with ISO timestamp
- countNewEnquiries: counts enquiries where status='NEW' (unread badge)
- updateEnquiryStatus: finds row by id, updates status field, returns mapped EnquiryDto; wraps in try/catch→mapPrismaError

Auth: createEnquiry: public (no guard); listEnquiries/countNewEnquiries/updateEnquiryStatus: requireAdmin internally

Side Effects:
DB writes (CREATE, UPDATE); timestamps auto-set by Prisma.

Notes:
No image handling. localeSent is metadata (not a foreign key) tracking which locale the contact form was submitted from. Email lowercasing prevents duplicate submissions from case-variant addresses.
