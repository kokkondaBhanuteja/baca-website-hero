import { listAllCategoriesForAdmin } from '@/lib/server/services/category-service'
import { ProductForm } from '../../../components/product-form'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const categories = await listAllCategoriesForAdmin()
  const options = categories.map((category) => ({
    id: category.id,
    label: category.name.en,
  }))

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        New product
      </h1>
      <ProductForm categories={options} />
    </div>
  )
}
