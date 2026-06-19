import { notFound } from 'next/navigation'

import { HttpError } from '@/lib/server/http/http-error'
import { getArticleForAdmin } from '@/lib/server/services/blog-article-service'
import { BlogArticleForm } from '../../../components/blog-article-form'

export const dynamic = 'force-dynamic'

export default async function EditBlogArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  try {
    const article = await getArticleForAdmin(id)
    return (
      <div>
        <h1 className="mb-8 font-heading text-3xl font-light text-ink">Edit article</h1>
        <BlogArticleForm initial={article} />
      </div>
    )
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) notFound()
    throw error
  }
}
