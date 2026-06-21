import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { parseAdminListQuery } from '@/lib/server/http/parse-admin-list-query'
import { created, ok } from '@/lib/server/http/respond'
import {
  createBlogType,
  listBlogTypesForAdmin,
} from '@/lib/server/services/blog-type-service'
import { blogTypeInputSchema } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

export const GET = handleRoute(async (request) => {
  await requireAdmin()
  return ok(await listBlogTypesForAdmin(parseAdminListQuery(request)))
})

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const input = blogTypeInputSchema.parse(await request.json())
  return created(await createBlogType(input))
})
