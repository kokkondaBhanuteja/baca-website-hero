import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { ok } from '@/lib/server/http/respond'

export const GET = handleRoute(async () => {
  const admin = await requireAdmin()
  return ok(admin)
})
