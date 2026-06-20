---
kind: 'api-route'
name: 'EnquiryDetailApi'
file: 'app/api/enquiry/[id]/route.ts'
exports:
  - 'PATCH'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/enquiry-service'
  - '@/lib/server/validation/enquiry-schema'
route: '/api/enquiry/[id]'
methods:
  - 'PATCH'
---

# EnquiryDetailApi

Route: `/api/enquiry/[id]`  
Methods: PATCH  
Envelope: via handleRoute

Purpose:
Update enquiry status (admin only). Used by admin inbox to mark enquiries as read, replied, etc.

## Per-method

### PATCH

- **Auth:** requireAdmin
- **Validation:** enquiryStatusSchema — status (enum: NEW / READ / REPLIED / ARCHIVED)
- **Service:** updateEnquiryStatus(id, status)
- **Response:** ok(enquiry) — returns updated enquiry
- **Errors:** 400 (validation), 401, 404

Notes:
GET/DELETE not implemented. Admins can only update status (no full edit or delete).
