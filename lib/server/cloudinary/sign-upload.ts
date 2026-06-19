import 'server-only'

import { isCloudinaryConfigured, serverEnvironment } from '@/lib/server/env'
import { badRequest } from '@/lib/server/http/http-error'
import type {
  UploadFolder,
  UploadSignature,
} from '@/lib/shared/types/upload-dto'

import { cloudinary } from './client'

/** Folders the admin uploader is allowed to write to (constrained server-side). */
export const UPLOAD_FOLDERS: readonly UploadFolder[] = [
  'baca/products',
  'baca/categories',
  'baca/blog',
  'baca/gallery',
]

/** Builds a short-lived Cloudinary upload signature. The API secret never leaves the server. */
export function createUploadSignature(folder: string): UploadSignature {
  if (!isCloudinaryConfigured) {
    throw badRequest('Image upload is not configured (missing Cloudinary credentials)')
  }
  if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) {
    throw badRequest('Invalid upload folder')
  }

  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    serverEnvironment.CLOUDINARY_API_SECRET,
  )

  return {
    signature,
    timestamp,
    apiKey: serverEnvironment.CLOUDINARY_API_KEY,
    cloudName: serverEnvironment.CLOUDINARY_CLOUD_NAME,
    folder: folder as UploadFolder,
  }
}

/** Best-effort delete of an uploaded asset (on entity delete or image replace). */
export async function destroyUploadedImage(
  publicId: string | null | undefined,
): Promise<void> {
  if (!publicId || !isCloudinaryConfigured) return
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('[cloudinary] Failed to destroy image', publicId, error)
  }
}
