import { notFound } from 'next/navigation'

import { getCategoryForAdmin } from '@/lib/server/services/category-service'
import { HttpError } from '@/lib/server/http/http-error'
import { CategoryForm } from '../../../components/category-form'

export const dynamic = 'force-dynamic'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await getCategoryForAdmin(id).catch((error: unknown) => {
    if (error instanceof HttpError && error.status === 404) notFound()
    throw error
  })

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        Edit category
      </h1>
      <CategoryForm initial={category} />
    </div>
  )
}
