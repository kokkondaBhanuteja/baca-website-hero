import Link from 'next/link'

import { listArticlesForAdmin } from '@/lib/server/services/blog-article-service'
import { DeleteEntityButton } from '../../components/delete-entity-button'

export const dynamic = 'force-dynamic'

export default async function BlogArticlesListPage() {
  const articles = await listArticlesForAdmin()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-light text-ink">
          Blog articles
        </h1>
        <Link
          href="/admin/blog-articles/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-ink-60">No articles yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-paper">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left font-mono text-[0.6rem] uppercase tracking-wider text-ink-60">
              <tr>
                <th className="px-5 py-3">Title (EN)</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-ink">
                    {article.title.en}
                    {article.featured && (
                      <span className="ms-2 rounded-full bg-saffron/15 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-saffron">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-60">
                    {article.slug}
                  </td>
                  <td className="px-5 py-3 text-ink-60">
                    {article.category.replace(/_/g, ' ').toLowerCase()}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        article.status === 'PUBLISHED'
                          ? 'text-forest'
                          : 'text-ink-60'
                      }
                    >
                      {article.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/blog-articles/${article.id}`}
                        className="text-sm text-ink/70 hover:text-ink"
                      >
                        Edit
                      </Link>
                      <DeleteEntityButton id={article.id} kind="article" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
