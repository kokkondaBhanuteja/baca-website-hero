---
kind: 'email'
name: 'Email'
file: 'lib/server/email/email.ts'
exports:
  - 'sendEnquiryNotification'
  - 'EnquiryEmailPayload'
imports_from:
  - 'nodemailer'
  - '@/lib/server/env'
called_by:
  - 'lib/server/services/enquiry-service/enquiry-service.ts'
auth: 'n/a (server-side transport)'
side_effects: 'Sends an outbound SMTP email; caches a nodemailer Transporter on first use; logs on warn/error.'
---

# Email

Purpose:
Server-only SMTP email sender for public enquiry notifications. Sends one email per submission to the team address configured via `ENQUIRY_NOTIFY_TO`. Best-effort: failures are caught + logged so the form submission never fails because of email trouble (the DB row is the source of truth).

Exports:

- `sendEnquiryNotification(payload: EnquiryEmailPayload): Promise<boolean>` — returns `true` on send success, `false` if SMTP isn't configured OR the send threw.
- `EnquiryEmailPayload` — the input shape (name / email / company? / phone? / message / localeSent).

Imports from:

- `nodemailer` — SMTP transport.
- `@/lib/server/env` — `serverEnvironment` (SMTP\_\*, ENQUIRY_NOTIFY_TO) + `isSmtpConfigured` guard.

Called by:

- `lib/server/services/enquiry-service/enquiry-service.ts` — fired from `createEnquiry()` after the Prisma row is committed.

Business Logic:

- `getTransporter()` lazy-creates and caches a singleton `nodemailer.Transporter`. `secure: true` is set when port 465 (implicit TLS); otherwise STARTTLS on the configured port (default 587).
- `isSmtpConfigured` guard: if any of `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` / `ENQUIRY_NOTIFY_TO` is empty, log a warning and return `false` (no throw — keep the form working in dev / before SMTP is wired up).
- Builds two bodies: a `plainText` flat block and an `html` template with escaped values (`escapeHtml`) and `<br>` for newlines in the message.
- `replyTo` is set to the submitter's email so the team can hit "Reply" and answer the buyer directly.
- Subject includes name + uppercase locale tag: `New enquiry from {name} ({EN})`.
- All errors during send are caught, logged with `console.error`, and turned into a `false` return — never thrown.

Configuration:

- `SMTP_HOST`, `SMTP_PORT` (default 587), `SMTP_USER`, `SMTP_PASSWORD` — transport credentials.
- `SMTP_FROM` — visible From: header. Must be authorised by the SMTP provider (or it will be rejected/spam-foldered).
- `ENQUIRY_NOTIFY_TO` — single destination address (the BACA team inbox).

Notes:

- The Transporter is module-scoped; in serverless runtimes each cold start spins up a fresh one, which is fine for low-volume contact-form traffic.
- HTML escaping is done in-module via `escapeHtml`; no external sanitiser dependency. We escape every interpolated value (including `mailto:` / `tel:` href values from the submitter) — defence in depth against header injection / XSS in the email client.
- For high-volume sending or richer templates, switch to a transactional provider (Resend, Postmark, SendGrid) — same `sendEnquiryNotification` interface, different transport.
