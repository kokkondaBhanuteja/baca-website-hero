import { getClientIp } from '@/lib/server/auth/client-ip'
import { rateLimit } from '@/lib/server/auth/rate-limit'
import { HttpError } from '@/lib/server/http/http-error'
import { handleRoute } from '@/lib/server/http/handle-route'
import { created } from '@/lib/server/http/respond'
import { createEnquiry } from '@/lib/server/services/enquiry-service'
import { enquiryInputSchema } from '@/lib/server/validation/enquiry-schema'

const ENQUIRY_RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }

// Public — anyone can submit an enquiry from the contact page. Rate-limited
// per IP so the inbox can't be flooded with spam from a single source. There
// is no admin GET here: enquiries are delivered by email (SMTP), not viewed
// in admin. The DB row is kept as an audit trail.
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
  return created(await createEnquiry(input))
})
