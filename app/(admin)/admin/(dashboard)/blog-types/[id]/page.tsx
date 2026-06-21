import { notFound } from 'next/navigation'

import { getBlogTypeForAdmin } from '@/lib/server/services/blog-type-service'
import { HttpError } from '@/lib/server/http/http-error'
import { BlogTypeForm } from '../../../components/blog-type-form'

export const dynamic = 'force-dynamic'

export default async function EditBlogTypePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blogType = await getBlogTypeForAdmin(id).catch((error: unknown) => {
    if (error instanceof HttpError && error.status === 404) notFound()
    throw error
  })

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        Edit blog type
      </h1>
      <BlogTypeForm initial={blogType} />
    </div>
  )
}
