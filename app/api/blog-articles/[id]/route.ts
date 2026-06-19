import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { noContent, ok } from '@/lib/server/http/respond'
import {
  deleteArticle,
  getArticleForAdmin,
  updateArticle,
} from '@/lib/server/services/blog-article-service'
import { blogArticleInputSchema } from '@/lib/server/validation/blog-article-schema'

export const GET = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  return ok(await getArticleForAdmin(id))
})

export const PATCH = handleRoute(async (request, { params }) => {
  await requireAdmin()
  const { id } = await params
  const input = blogArticleInputSchema.parse(await request.json())
  return ok(await updateArticle(id, input))
})

export const DELETE = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  await deleteArticle(id)
  return noContent()
})
