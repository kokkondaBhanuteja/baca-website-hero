import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { noContent, ok } from '@/lib/server/http/respond'
import {
  deleteBlogType,
  getBlogTypeForAdmin,
  updateBlogType,
} from '@/lib/server/services/blog-type-service'
import { blogTypeInputSchema } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

export const GET = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  return ok(await getBlogTypeForAdmin(id))
})

export const PATCH = handleRoute(async (request, { params }) => {
  await requireAdmin()
  const { id } = await params
  const input = blogTypeInputSchema.parse(await request.json())
  return ok(await updateBlogType(id, input))
})

export const DELETE = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  await deleteBlogType(id)
  return noContent()
})
