import 'server-only'

import { sendEnquiryNotification } from '@/lib/server/email'
import { HttpError } from '@/lib/server/http/http-error'
import type { EnquiryInput } from '@/lib/server/validation/enquiry-schema'

/**
 * Public contact-form submission. Pure email-only: zod-validated input is
 * forwarded to the BACA team via SMTP. We deliberately do NOT persist a DB
 * row — the original `enquiries` table was removed once SMTP became the sole
 * notification path. Trade-off documented in the contact-strip / enquiry-form
 * sidecars: if SMTP is misconfigured or the send fails, the submission is
 * lost. We surface that as a 503 so the form shows a clear error instead of
 * pretending success.
 */
export async function createEnquiry(input: EnquiryInput): Promise<void> {
  const payload = {
    name: input.name,
    email: input.email.toLowerCase(),
    company: input.company ?? null,
    phone: input.phone ?? null,
    country: input.country,
    message: input.message,
    localeSent: input.localeSent,
  }

  const sent = await sendEnquiryNotification(payload)
  if (!sent) {
    throw new HttpError(
      503,
      'EMAIL_SEND_FAILED',
      'We could not send your enquiry right now. Please email us directly or try again shortly.',
    )
  }
}
