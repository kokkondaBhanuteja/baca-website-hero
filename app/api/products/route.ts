import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { created, ok } from '@/lib/server/http/respond'
import {
  createProduct,
  listProductsForAdmin,
} from '@/lib/server/services/product-service'
import { productInputSchema } from '@/lib/server/validation/product-schema'

export const GET = handleRoute(async () => {
  await requireAdmin()
  return ok(await listProductsForAdmin())
})

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const input = productInputSchema.parse(await request.json())
  return created(await createProduct(input))
})
