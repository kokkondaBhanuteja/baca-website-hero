---
kind: 'page'
name: 'EnquiriesPage'
file: 'app/(admin)/admin/(dashboard)/enquiries/page.tsx'
exports:
  - 'dynamic'
  - 'EnquiriesPage'
  - 'default'
imports_from:
  - '@/lib/server/services/enquiry-service'
route: '/admin/enquiries'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# EnquiriesPage

Route: `/admin/enquiries`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Admin enquiries inbox. Displays table of all contact form submissions with name, email, company, phone, message, locale, date, and status (with EnquiryStatusControl dropdown).

Data:

- listEnquiries() — all enquiries with name, email, company, phone, message, localeSent, createdAt, status, id

Business Logic:

- export const dynamic = 'force-dynamic'
- Table: From col (name + email link + company + phone), Message, Locale, Date (YYYY-MM-DD), Status (dropdown via EnquiryStatusControl)
- EnquiryStatusControl allows admin to change status per enquiry

Renders:

- Heading 'Enquiries'
- Table or empty message

Notes:
Email is a mailto: link. Date formatted from createdAt ISO string (slice first 10 chars). Status control is a client component.
