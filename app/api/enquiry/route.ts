import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { created, ok } from '@/lib/server/http/respond'
import {
  createEnquiry,
  listEnquiries,
} from '@/lib/server/services/enquiry-service'
import { enquiryInputSchema } from '@/lib/server/validation/enquiry-schema'

// Public — anyone can submit an enquiry from the contact page.
export const POST = handleRoute(async (request) => {
  const input = enquiryInputSchema.parse(await request.json())
  return created(await createEnquiry(input))
})

// Admin — the enquiries inbox.
export const GET = handleRoute(async () => {
  await requireAdmin()
  return ok(await listEnquiries())
})
