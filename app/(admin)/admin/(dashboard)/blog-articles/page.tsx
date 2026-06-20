import Link from 'next/link'

import { listArticlesForAdmin } from '@/lib/server/services/blog-article-service'
import { ADMIN_LIST_DEFAULT_PAGE_SIZE } from '@/lib/shared/types/paginated-list'
import { BlogArticlesTable } from '../../components/blog-articles-table'

export const dynamic = 'force-dynamic'

function parsePage(raw: string | undefined): number {
  if (!raw) return 1
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export default async function BlogArticlesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageRaw, q = '' } = await searchParams
  const page = parsePage(pageRaw)
  const result = await listArticlesForAdmin({
    page,
    pageSize: ADMIN_LIST_DEFAULT_PAGE_SIZE,
    search: q,
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
        <h1 className="font-heading text-2xl font-light text-ink sm:text-3xl">
          Blog articles
        </h1>
        <Link
          href="/admin/blog-articles/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          New article
        </Link>
      </div>

      <BlogArticlesTable
        items={result.items}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        search={q}
      />
    </div>
  )
}
