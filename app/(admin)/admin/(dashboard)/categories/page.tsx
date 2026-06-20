import Link from 'next/link'

import { listCategoriesForAdmin } from '@/lib/server/services/category-service'
import { DeleteEntityButton } from '../../components/delete-entity-button'

export const dynamic = 'force-dynamic'

export default async function CategoriesListPage() {
  const categories = await listCategoriesForAdmin()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-light text-ink">
          Categories
        </h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          New category
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-ink-60">
          No categories yet. Create the first one.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-paper">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left font-mono text-[0.6rem] uppercase tracking-wider text-ink-60">
              <tr>
                <th className="px-5 py-3">Name (EN)</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-5 py-3 font-medium text-ink">
                    {category.name.en}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-60">
                    {category.slug}
                  </td>
                  <td className="px-5 py-3 text-ink-60">
                    {category.productCount}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        category.isPublished ? 'text-forest' : 'text-ink-60'
                      }
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
