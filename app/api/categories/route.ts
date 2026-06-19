import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { created, ok } from '@/lib/server/http/respond'
import {
  createCategory,
  listCategoriesForAdmin,
} from '@/lib/server/services/category-service'
import { categoryInputSchema } from '@/lib/server/validation/category-schema'

export const GET = handleRoute(async () => {
  await requireAdmin()
  return ok(await listCategoriesForAdmin())
})

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const input = categoryInputSchema.parse(await request.json())
  return created(await createCategory(input))
})
