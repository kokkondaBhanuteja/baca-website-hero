import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { parseAdminListQuery } from '@/lib/server/http/parse-admin-list-query'
import { created, ok } from '@/lib/server/http/respond'
import {
  createArticle,
  listArticlesForAdmin,
} from '@/lib/server/services/blog-article-service'
import { blogArticleInputSchema } from '@/lib/server/validation/blog-article-schema'

export const GET = handleRoute(async (request) => {
  await requireAdmin()
  return ok(await listArticlesForAdmin(parseAdminListQuery(request)))
})

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const input = blogArticleInputSchema.parse(await request.json())
  return created(await createArticle(input))
})
