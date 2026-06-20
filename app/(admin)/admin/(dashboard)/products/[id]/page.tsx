import { notFound } from 'next/navigation'

import { HttpError } from '@/lib/server/http/http-error'
import { listAllCategoriesForAdmin } from '@/lib/server/services/category-service'
import { getProductForAdmin } from '@/lib/server/services/product-service'
import { ProductForm } from '../../../components/product-form'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductForAdmin(id).catch((error: unknown) => {
      if (error instanceof HttpError && error.status === 404) notFound()
      throw error
    }),
    listAllCategoriesForAdmin(),
  ])
  const options = categories.map((category) => ({
    id: category.id,
    label: category.name.en,
  }))

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        Edit product
      </h1>
      <ProductForm initial={product} categories={options} />
    </div>
  )
}
