import { CategoryForm } from '../../../components/category-form'

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        New category
      </h1>
      <CategoryForm />
    </div>
  )
}
