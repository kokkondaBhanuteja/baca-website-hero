import { z } from 'zod'

import { requireAdmin } from '@/lib/server/auth/require-admin'
import { createUploadSignature } from '@/lib/server/cloudinary/sign-upload'
import { handleRoute } from '@/lib/server/http/handle-route'
import { ok } from '@/lib/server/http/respond'

const signRequestSchema = z.object({ folder: z.string().min(1) })

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const { folder } = signRequestSchema.parse(await request.json())
  return ok(createUploadSignature(folder))
})
