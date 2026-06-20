'use client'

import Link from 'next/link'

import type { ProductAdminDto } from '@/lib/shared/types/catalogue-dto'

import {
  AdminListTable,
  useAdminListUrlState,
} from '@/app/(admin)/admin/components/admin-list-table'
import { DeleteEntityButton } from '@/app/(admin)/admin/components/delete-entity-button'

export interface ProductsTableProps {
  items: ProductAdminDto[]
  total: number
  page: number
  pageSize: number
  search: string
}

export function ProductsTable({
  items,
  total,
  page,
  pageSize,
  search,
}: ProductsTableProps) {
  const urlState = useAdminListUrlState({ initialSearch: search })

  return (
    <AdminListTable<ProductAdminDto>
      items={items}
      total={total}
      page={page}
      pageSize={pageSize}
      {...urlState}
      minWidth={640}
      columnCount={5}
      searchPlaceholder="Search products by name, slug or category…"
      emptyMessage="No products yet. Create a category first, then add products."
      emptyFilteredMessage="No products match this search."
      header={
        <tr>
          <th className="px-5 py-3">Name (EN)</th>
          <th className="px-5 py-3">Slug</th>
          <th className="px-5 py-3">Category</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3 text-end">Actions</th>
        </tr>
      }
      renderRow={(product) => (
        <tr key={product.id} className="border-b border-line last:border-0">
          <td className="px-5 py-3 font-medium text-ink">{product.name.en}</td>
          <td className="px-5 py-3 font-mono text-xs text-ink-60">
            {product.slug}
          </td>
          <td className="px-5 py-3 text-ink-60">{product.categoryName.en}</td>
          <td className="px-5 py-3">
            <span
              className={product.isPublished ? 'text-forest' : 'text-ink-60'}
            >
              {product.isPublished ? 'Published' : 'Draft'}
            </span>
          </td>
          <td className="px-5 py-3">
            <div className="flex items-center justify-end gap-4">
              <Link
                href={`/admin/products/${product.id}`}
                className="text-sm text-ink/70 hover:text-ink"
              >
                Edit
              </Link>
              <DeleteEntityButton id={product.id} kind="product" />
            </div>
          </td>
        </tr>
      )}
      renderCard={(product) => (
        <article
          key={product.id}
          className="rounded-2xl border border-line bg-paper p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-ink">
                {product.name.en}
              </h3>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-60">
                {product.slug}
              </p>
            </div>
            <span
              className={`shrink-0 text-xs ${product.isPublished ? 'text-forest' : 'text-ink-60'}`}
            >
              {product.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="mt-3 text-sm">
            <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-60">
              Category
            </span>
            <span className="ms-2 text-ink/80">{product.categoryName.en}</span>
          </p>
          <div className="mt-4 flex items-center justify-end gap-4 border-t border-line pt-3">
            <Link
              href={`/admin/products/${product.id}`}
              className="text-sm text-ink/70 hover:text-ink"
            >
              Edit
            </Link>
            <DeleteEntityButton id={product.id} kind="product" />
          </div>
        </article>
      )}
    />
  )
}
