import { BlogArticleForm } from '../../../components/blog-article-form'

export default function NewBlogArticlePage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        New article
      </h1>
      <BlogArticleForm />
    </div>
  )
}
