import Link from 'next/link'

import { listProductsForAdmin } from '@/lib/server/services/product-service'
import { DeleteEntityButton } from '../../components/delete-entity-button'

export const dynamic = 'force-dynamic'

export default async function ProductsListPage() {
  const products = await listProductsForAdmin()

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-light text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          New product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-ink-60">
          No products yet. Create a category first, then add products.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-paper">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left font-mono text-[0.6rem] uppercase tracking-wider text-ink-60">
              <tr>
                <th className="px-5 py-3">Name (EN)</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{product.name.en}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-60">{product.slug}</td>
                  <td className="px-5 py-3 text-ink-60">{product.categoryName.en}</td>
                  <td className="px-5 py-3">
                    <span className={product.isPublished ? 'text-forest' : 'text-ink-60'}>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
