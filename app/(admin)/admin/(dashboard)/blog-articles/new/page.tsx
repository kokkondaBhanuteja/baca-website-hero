import { listAllBlogTypesForAdmin } from '@/lib/server/services/blog-type-service'
import { BlogArticleForm } from '../../../components/blog-article-form'

export const dynamic = 'force-dynamic'

export default async function NewBlogArticlePage() {
  const blogTypes = await listAllBlogTypesForAdmin()
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        New article
      </h1>
      <BlogArticleForm blogTypes={blogTypes} />
    </div>
  )
}
