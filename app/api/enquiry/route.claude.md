---
kind: 'api-route'
name: 'EnquiryApi'
file: 'app/api/enquiry/route.ts'
exports:
  - 'POST'
  - 'GET'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/enquiry-service'
  - '@/lib/server/validation/enquiry-schema'
route: '/api/enquiry'
methods:
  - 'GET'
  - 'POST'
---

# EnquiryApi

Route: `/api/enquiry`  
Methods: GET, POST  
Envelope: via handleRoute

Purpose:
Contact form enquiries. POST is public (anyone can submit from contact page). GET is admin-only (fetch inbox).

## Per-method

### POST

- **Auth:** Public
- **Validation:** enquiryInputSchema — name (string), email (string), phone (string, optional), company (string, optional), message (string), localeSent (Locale)
- **Service:** createEnquiry(input) — creates enquiry record
- **Response:** created(enquiry) — 201
- **Errors:** 400 (validation)

### GET

- **Auth:** requireAdmin
- **Validation:** None
- **Service:** listEnquiries() — all enquiries with all fields + status
- **Response:** ok(enquiries)
- **Errors:** 401

Notes:
POST endpoint is the only public data submission (besides login). localeSent stored to track which locale visitor submitted from.
