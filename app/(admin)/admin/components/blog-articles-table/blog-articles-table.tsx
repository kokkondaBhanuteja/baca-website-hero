'use client'

import Link from 'next/link'

import type { BlogArticleAdminDto } from '@/lib/shared/types/blog-dto'

import {
  AdminListTable,
  useAdminListUrlState,
} from '@/app/(admin)/admin/components/admin-list-table'
import { DeleteEntityButton } from '@/app/(admin)/admin/components/delete-entity-button'

export interface BlogArticlesTableProps {
  items: BlogArticleAdminDto[]
  total: number
  page: number
  pageSize: number
  search: string
}

export function BlogArticlesTable({
  items,
  total,
  page,
  pageSize,
  search,
}: BlogArticlesTableProps) {
  const urlState = useAdminListUrlState({ initialSearch: search })

  return (
    <AdminListTable<BlogArticleAdminDto>
      items={items}
      total={total}
      page={page}
      pageSize={pageSize}
      {...urlState}
      minWidth={720}
      columnCount={5}
      searchPlaceholder="Search articles by title or slug…"
      emptyMessage="No articles yet."
      emptyFilteredMessage="No articles match this search."
      header={
        <tr>
          <th className="px-5 py-3">Title (EN)</th>
          <th className="px-5 py-3">Slug</th>
          <th className="px-5 py-3">Blog type</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3 text-end">Actions</th>
        </tr>
      }
      renderRow={(article) => (
        <tr key={article.id} className="border-b border-line last:border-0">
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
          <td className="px-5 py-3 text-ink-60">{article.blogTypeName}</td>
          <td className="px-5 py-3">
            <span
              className={
                article.status === 'PUBLISHED' ? 'text-forest' : 'text-ink-60'
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
      )}
      renderCard={(article) => (
        <article
          key={article.id}
          className="rounded-2xl border border-line bg-paper p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-ink">
                {article.title.en}
                {article.featured && (
                  <span className="ms-2 rounded-full bg-saffron/15 px-2 py-0.5 align-middle font-mono text-[0.55rem] uppercase tracking-wider text-saffron">
                    Featured
                  </span>
                )}
              </h3>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-60">
                {article.slug}
              </p>
            </div>
            <span
              className={`shrink-0 text-xs ${article.status === 'PUBLISHED' ? 'text-forest' : 'text-ink-60'}`}
            >
              {article.status === 'PUBLISHED' ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="mt-3 text-sm">
            <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-60">
              Category
            </span>
            <span className="ms-2 text-ink/80">{article.blogTypeName}</span>
          </p>
          <div className="mt-4 flex items-center justify-end gap-4 border-t border-line pt-3">
            <Link
              href={`/admin/blog-articles/${article.id}`}
              className="text-sm text-ink/70 hover:text-ink"
            >
              Edit
            </Link>
            <DeleteEntityButton id={article.id} kind="article" />
          </div>
        </article>
      )}
    />
  )
}
