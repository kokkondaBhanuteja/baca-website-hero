import { getClientIp } from '@/lib/server/auth/client-ip'
import { rateLimit } from '@/lib/server/auth/rate-limit'
import { HttpError } from '@/lib/server/http/http-error'
import { handleRoute } from '@/lib/server/http/handle-route'
import { created } from '@/lib/server/http/respond'
import { createEnquiry } from '@/lib/server/services/enquiry-service'
import { enquiryInputSchema } from '@/lib/server/validation/enquiry-schema'

const ENQUIRY_RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }

// Public — anyone can submit an enquiry from the contact form (shown on every
// page via the global pre-footer strip + the dedicated /contact panel).
// Rate-limited per IP so the inbox can't be flooded with spam from a single
// source. Email-only — `createEnquiry` validates and forwards via SMTP; no DB
// persistence (the Enquiry table was removed once SMTP became the sole
// notification path).
export const POST = handleRoute(async (request) => {
  const ip = await getClientIp()
  const limit = rateLimit(`enquiry:${ip}`, ENQUIRY_RATE_LIMIT)
  if (!limit.ok) {
    throw new HttpError(
      429,
      'RATE_LIMITED',
      `Too many enquiries from this source. Try again in ${limit.retryAfterSeconds} seconds.`,
    )
  }
  const input = enquiryInputSchema.parse(await request.json())
  await createEnquiry(input)
  return created({ ok: true })
})
