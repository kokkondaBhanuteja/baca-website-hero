import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { ok } from '@/lib/server/http/respond'
import { updateEnquiryStatus } from '@/lib/server/services/enquiry-service'
import { enquiryStatusSchema } from '@/lib/server/validation/enquiry-schema'

export const PATCH = handleRoute(async (request, { params }) => {
  await requireAdmin()
  const { id } = await params
  const { status } = enquiryStatusSchema.parse(await request.json())
  return ok(await updateEnquiryStatus(id, status))
})
