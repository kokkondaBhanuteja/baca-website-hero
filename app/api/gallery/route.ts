import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { created, ok } from '@/lib/server/http/respond'
import {
  createGalleryImage,
  listGalleryForAdmin,
} from '@/lib/server/services/gallery-service'
import { galleryImageInputSchema } from '@/lib/server/validation/gallery-schema'

export const GET = handleRoute(async () => {
  await requireAdmin()
  return ok(await listGalleryForAdmin())
})

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const input = galleryImageInputSchema.parse(await request.json())
  return created(await createGalleryImage(input))
})
