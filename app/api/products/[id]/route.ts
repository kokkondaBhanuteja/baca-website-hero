import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { noContent, ok } from '@/lib/server/http/respond'
import {
  deleteProduct,
  getProductForAdmin,
  updateProduct,
} from '@/lib/server/services/product-service'
import { productInputSchema } from '@/lib/server/validation/product-schema'

export const GET = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  return ok(await getProductForAdmin(id))
})

export const PATCH = handleRoute(async (request, { params }) => {
  await requireAdmin()
  const { id } = await params
  const input = productInputSchema.parse(await request.json())
  return ok(await updateProduct(id, input))
})

export const DELETE = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  await deleteProduct(id)
  return noContent()
})
