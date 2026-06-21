import { notFound } from 'next/navigation'

import { HttpError } from '@/lib/server/http/http-error'
import { getArticleForAdmin } from '@/lib/server/services/blog-article-service'
import { listAllBlogTypesForAdmin } from '@/lib/server/services/blog-type-service'
import { BlogArticleForm } from '../../../components/blog-article-form'

export const dynamic = 'force-dynamic'

export default async function EditBlogArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getArticleForAdmin(id).catch((error: unknown) => {
    if (error instanceof HttpError && error.status === 404) notFound()
    throw error
  })
  const blogTypes = await listAllBlogTypesForAdmin()

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        Edit article
      </h1>
      <BlogArticleForm initial={article} blogTypes={blogTypes} />
    </div>
  )
}
