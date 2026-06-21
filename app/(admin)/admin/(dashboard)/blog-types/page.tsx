import Link from 'next/link'

import { listBlogTypesForAdmin } from '@/lib/server/services/blog-type-service'
import { ADMIN_LIST_DEFAULT_PAGE_SIZE } from '@/lib/shared/types/paginated-list'
import { BlogTypesTable } from '../../components/blog-types-table'

export const dynamic = 'force-dynamic'

function parsePage(raw: string | undefined): number {
  if (!raw) return 1
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export default async function BlogTypesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageRaw, q = '' } = await searchParams
  const page = parsePage(pageRaw)
  const result = await listBlogTypesForAdmin({
    page,
    pageSize: ADMIN_LIST_DEFAULT_PAGE_SIZE,
    search: q,
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
        <h1 className="font-heading text-2xl font-light text-ink sm:text-3xl">
          Blog types
        </h1>
        <Link
          href="/admin/blog-types/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          New blog type
        </Link>
      </div>

      <BlogTypesTable
        items={result.items}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        search={q}
      />
    </div>
  )
}
