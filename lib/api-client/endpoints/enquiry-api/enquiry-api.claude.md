---
kind: 'endpoint'
name: 'EnquiryApi'
file: 'lib/api-client/endpoints/enquiry-api/enquiry-api.ts'
exports:
  - 'enquiryApi'
imports_from:
  - '@/lib/shared/types/enquiry-dto'
  - '@/lib/server/validation/enquiry-schema'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'app/(admin)/admin/components/enquiry-status-control/enquiry-status-control.tsx'
  - 'components/sections/contact/enquiry-form/enquiry-form.tsx'
auth: 'submit is public; list and updateStatus require valid session cookie (enforced server-side)'
side_effects: 'HTTP requests to /api/enquiry/*; DB writes server-side.'
---

# EnquiryApi

Purpose:
Typed axios wrappers for enquiry endpoints. Public contact form submissions and admin enquiry inbox.

Exports:

- enquiryApi: object — { submit, list, updateStatus }

Imports from:

- @/lib/shared/types/enquiry-dto — EnquiryDto, EnquiryStatusValue
- @/lib/server/validation/enquiry-schema — EnquiryInput (type-only import)
- @/lib/api-client/axios-instance — apiClient instance

Called by:

- app/(site)/[locale]/contact/page.tsx (calls enquiryApi.submit from public form)
- app/(admin)/admin/(dashboard)/enquiries/page.tsx (calls enquiryApi.list and enquiryApi.updateStatus)

Business Logic:

- submit: POST /api/enquiry with EnquiryInput body → returns { id: string } (public, no auth required)
- list: GET /api/enquiry → returns EnquiryDto[] (admin-only)
- updateStatus: PATCH /api/enquiry/:id with { status } body → returns EnquiryDto (admin-only)

Auth: submit is public; list and updateStatus require valid session cookie (enforced server-side)

Side Effects:
HTTP requests to /api/enquiry/\*; DB writes server-side.

Notes:
submit is the only public endpoint in this group. EnquiryInput is type-only. updateStatus updates only the status field (not other fields).
