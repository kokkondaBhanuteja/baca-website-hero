import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { noContent, ok } from '@/lib/server/http/respond'
import {
  deleteCategory,
  getCategoryForAdmin,
  updateCategory,
} from '@/lib/server/services/category-service'
import { categoryInputSchema } from '@/lib/server/validation/category-schema'

export const GET = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  return ok(await getCategoryForAdmin(id))
})

export const PATCH = handleRoute(async (request, { params }) => {
  await requireAdmin()
  const { id } = await params
  const input = categoryInputSchema.parse(await request.json())
  return ok(await updateCategory(id, input))
})

export const DELETE = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  await deleteCategory(id)
  return noContent()
})
