import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { noContent } from '@/lib/server/http/respond'
import { deleteGalleryImage } from '@/lib/server/services/gallery-service'

export const DELETE = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  await deleteGalleryImage(id)
  return noContent()
})
