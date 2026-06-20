---
kind: 'component'
name: 'EnquiryStatusControl'
file: 'app/(admin)/admin/components/enquiry-status-control/enquiry-status-control.tsx'
exports:
  - 'EnquiryStatusControl'
imports_from:
  - '@/lib/api-client/endpoints/enquiry-api'
  - '@/lib/shared/types/enquiry-dto'
  - '@/components/ui/dropdown'
---

# EnquiryStatusControl

Purpose:
Inline dropdown status selector for enquiries: NEW | READ | ARCHIVED. Updates via API and re-renders.

Used In:

- Admin enquiries list page — status column per enquiry row

Props:

- id: string — enquiry ID
- status: EnquiryStatusValue — current status

Business Logic:

- useState: value (status), busy flag
- onChange → handleChange(next): setBusy(true), setValue(next), calls enquiryApi.updateStatus(id, next), on success router.refresh(), on error reverts value + busy
- Dropdown with STATUSES array mapped to {value, label} options
- Disabled while busy
- menuAlign='end' positions dropdown to the right (table row context)

Dependencies:

- React hooks: useState
- next/navigation: useRouter
- @/lib/api-client/endpoints/enquiry-api
- @/lib/shared/types/enquiry-dto
- @/components/ui/dropdown

i18n:
None — hardcoded status labels (NEW, READ, ARCHIVED)

Accessibility:
Dropdown a11y inherited.

Notes:
Typically rendered inline in a table row. If the update fails, the value reverts (optimistic UI with rollback). The busy flag prevents multiple concurrent updates.
