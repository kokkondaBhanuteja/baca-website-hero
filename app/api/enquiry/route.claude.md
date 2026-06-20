---
kind: 'api-route'
name: 'EnquiryApi'
file: 'app/api/enquiry/route.ts'
exports:
  - 'POST'
imports_from:
  - '@/lib/server/auth/client-ip'
  - '@/lib/server/auth/rate-limit'
  - '@/lib/server/http/http-error'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/enquiry-service'
  - '@/lib/server/validation/enquiry-schema'
route: '/api/enquiry'
methods:
  - 'POST'
---

# EnquiryApi

Route: `/api/enquiry`  
Methods: POST  
Envelope: via handleRoute

Purpose:
Public contact-form submission endpoint. There is no admin GET / PATCH here — enquiries are delivered to the team by SMTP email (see `lib/server/email`). The DB row is kept as an audit trail.

## Per-method

### POST

- **Auth:** Public (no guard).
- **Rate limit:** 5 requests per IP per 10 minutes via `rateLimit('enquiry:${ip}', …)`. IP resolved via `getClientIp()` (resists XFF spoofing).
- **Validation:** `enquiryInputSchema` — name, email, optional company, optional phone, message, localeSent.
- **Service:** `createEnquiry(input)` — writes the DB row, then best-effort sends an SMTP notification to `ENQUIRY_NOTIFY_TO`. Email failures are caught and logged; the request still succeeds.
- **Response:** `created({ id })` — 201 with the new row's cuid.
- **Errors:** 422 (zod validation), 429 (rate-limited).

Notes:
This is the only public POST endpoint on the API. The admin GET / PATCH that used to live here were removed when enquiries moved to email-only delivery; the `enquiry-status-control` component and admin inbox page were deleted at the same time.
