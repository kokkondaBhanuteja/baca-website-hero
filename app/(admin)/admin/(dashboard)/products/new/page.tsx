import { listCategoriesForAdmin } from '@/lib/server/services/category-service'
import { ProductForm } from '../../../components/product-form'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const categories = await listCategoriesForAdmin()
  const options = categories.map((category) => ({
    id: category.id,
    label: category.name.en,
  }))

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-light text-ink">New product</h1>
      <ProductForm categories={options} />
    </div>
  )
}
