import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { parseAdminListQuery } from '@/lib/server/http/parse-admin-list-query'
import { created, ok } from '@/lib/server/http/respond'
import {
  createProduct,
  listProductsForAdmin,
} from '@/lib/server/services/product-service'
import { productInputSchema } from '@/lib/server/validation/product-schema'

export const GET = handleRoute(async (request) => {
  await requireAdmin()
  return ok(await listProductsForAdmin(parseAdminListQuery(request)))
})

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const input = productInputSchema.parse(await request.json())
  return created(await createProduct(input))
})
