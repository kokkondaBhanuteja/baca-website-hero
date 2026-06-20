'use client'

import Link from 'next/link'

import type { ProductCategoryAdminDto } from '@/lib/shared/types/catalogue-dto'

import {
  AdminListTable,
  useAdminListUrlState,
} from '@/app/(admin)/admin/components/admin-list-table'
import { DeleteEntityButton } from '@/app/(admin)/admin/components/delete-entity-button'

type CategoryRow = ProductCategoryAdminDto & { productCount: number }

export interface CategoriesTableProps {
  items: CategoryRow[]
  total: number
  page: number
  pageSize: number
  search: string
}

export function CategoriesTable({
  items,
  total,
  page,
  pageSize,
  search,
}: CategoriesTableProps) {
  const urlState = useAdminListUrlState({ initialSearch: search })

  return (
    <AdminListTable<CategoryRow>
      items={items}
      total={total}
      page={page}
      pageSize={pageSize}
      {...urlState}
      minWidth={640}
      columnCount={5}
      searchPlaceholder="Search categories by name or slug…"
      emptyMessage="No categories yet. Create the first one."
      emptyFilteredMessage="No categories match this search."
      header={
        <tr>
          <th className="px-5 py-3">Name (EN)</th>
          <th className="px-5 py-3">Slug</th>
          <th className="px-5 py-3">Products</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3 text-end">Actions</th>
        </tr>
      }
      renderRow={(category) => (
        <tr key={category.id} className="border-b border-line last:border-0">
          <td className="px-5 py-3 font-medium text-ink">{category.name.en}</td>
          <td className="px-5 py-3 font-mono text-xs text-ink-60">
            {category.slug}
          </td>
          <td className="px-5 py-3 text-ink-60">{category.productCount}</td>
          <td className="px-5 py-3">
            <span
              className={category.isPublished ? 'text-forest' : 'text-ink-60'}
            >
              {category.isPublished ? 'Published' : 'Draft'}
            </span>
          </td>
          <td className="px-5 py-3">
            <div className="flex items-center justify-end gap-4">
              <Link
                href={`/admin/categories/${category.id}`}
                className="text-sm text-ink/70 hover:text-ink"
              >
                Edit
              </Link>
              <DeleteEntityButton id={category.id} kind="category" />
            </div>
          </td>
        </tr>
      )}
      renderCard={(category) => (
        <article
          key={category.id}
          className="rounded-2xl border border-line bg-paper p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-ink">
                {category.name.en}
              </h3>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-60">
                {category.slug}
              </p>
            </div>
            <span
              className={`shrink-0 text-xs ${category.isPublished ? 'text-forest' : 'text-ink-60'}`}
            >
              {category.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="mt-3 text-sm">
            <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-60">
              Products
            </span>
            <span className="ms-2 text-ink/80">{category.productCount}</span>
          </p>
          <div className="mt-4 flex items-center justify-end gap-4 border-t border-line pt-3">
            <Link
              href={`/admin/categories/${category.id}`}
              className="text-sm text-ink/70 hover:text-ink"
            >
              Edit
            </Link>
            <DeleteEntityButton id={category.id} kind="category" />
          </div>
        </article>
      )}
    />
  )
}
