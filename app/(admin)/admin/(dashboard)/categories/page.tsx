import Link from 'next/link'

import { listCategoriesForAdmin } from '@/lib/server/services/category-service'
import { ADMIN_LIST_DEFAULT_PAGE_SIZE } from '@/lib/shared/types/paginated-list'
import { CategoriesTable } from '../../components/categories-table'

export const dynamic = 'force-dynamic'

function parsePage(raw: string | undefined): number {
  if (!raw) return 1
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export default async function CategoriesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageRaw, q = '' } = await searchParams
  const page = parsePage(pageRaw)
  const result = await listCategoriesForAdmin({
    page,
    pageSize: ADMIN_LIST_DEFAULT_PAGE_SIZE,
    search: q,
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
        <h1 className="font-heading text-2xl font-light text-ink sm:text-3xl">
          Categories
        </h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          New category
        </Link>
      </div>

      <CategoriesTable
        items={result.items}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        search={q}
      />
    </div>
  )
}
