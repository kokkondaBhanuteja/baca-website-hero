'use client'

import Link from 'next/link'

import type { BlogTypeAdminDto } from '@/lib/shared/types/blog-type-dto'

import {
  AdminListTable,
  useAdminListUrlState,
} from '@/app/(admin)/admin/components/admin-list-table'
import { DeleteEntityButton } from '@/app/(admin)/admin/components/delete-entity-button'

export interface BlogTypesTableProps {
  items: BlogTypeAdminDto[]
  total: number
  page: number
  pageSize: number
  search: string
}

export function BlogTypesTable({
  items,
  total,
  page,
  pageSize,
  search,
}: BlogTypesTableProps) {
  const urlState = useAdminListUrlState({ initialSearch: search })

  return (
    <AdminListTable<BlogTypeAdminDto>
      items={items}
      total={total}
      page={page}
      pageSize={pageSize}
      {...urlState}
      minWidth={640}
      columnCount={5}
      searchPlaceholder="Search blog types by name or slug…"
      emptyMessage="No blog types yet. Create the first one."
      emptyFilteredMessage="No blog types match this search."
      header={
        <tr>
          <th className="px-5 py-3">Name (EN)</th>
          <th className="px-5 py-3">Slug</th>
          <th className="px-5 py-3">Articles</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3 text-end">Actions</th>
        </tr>
      }
      renderRow={(type) => (
        <tr key={type.id} className="border-b border-line last:border-0">
          <td className="px-5 py-3 font-medium text-ink">{type.name.en}</td>
          <td className="px-5 py-3 font-mono text-xs text-ink-60">
            {type.slug}
          </td>
          <td className="px-5 py-3 text-ink-60">{type.articleCount}</td>
          <td className="px-5 py-3">
            <span className={type.isPublished ? 'text-forest' : 'text-ink-60'}>
              {type.isPublished ? 'Published' : 'Draft'}
            </span>
          </td>
          <td className="px-5 py-3">
            <div className="flex items-center justify-end gap-4">
              <Link
                href={`/admin/blog-types/${type.id}`}
                className="text-sm text-ink/70 hover:text-ink"
              >
                Edit
              </Link>
              <DeleteEntityButton id={type.id} kind="blogType" />
            </div>
          </td>
        </tr>
      )}
      renderCard={(type) => (
        <article
          key={type.id}
          className="rounded-2xl border border-line bg-paper p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-ink">{type.name.en}</h3>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-60">
                {type.slug}
              </p>
            </div>
            <span
              className={`shrink-0 text-xs ${type.isPublished ? 'text-forest' : 'text-ink-60'}`}
            >
              {type.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="mt-3 text-sm">
            <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-60">
              Articles
            </span>
            <span className="ms-2 text-ink/80">{type.articleCount}</span>
          </p>
          <div className="mt-4 flex items-center justify-end gap-4 border-t border-line pt-3">
            <Link
              href={`/admin/blog-types/${type.id}`}
              className="text-sm text-ink/70 hover:text-ink"
            >
              Edit
            </Link>
            <DeleteEntityButton id={type.id} kind="blogType" />
          </div>
        </article>
      )}
    />
  )
}
