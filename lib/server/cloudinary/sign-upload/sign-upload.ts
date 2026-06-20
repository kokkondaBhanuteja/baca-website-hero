import 'server-only'

import { isCloudinaryConfigured, serverEnvironment } from '@/lib/server/env'
import { badRequest } from '@/lib/server/http/http-error'
import type {
  UploadFolder,
  UploadSignature,
} from '@/lib/shared/types/upload-dto'

import { cloudinary } from '@/lib/server/cloudinary/client'

/** Folders the admin uploader is allowed to write to (constrained server-side). */
export const UPLOAD_FOLDERS: readonly UploadFolder[] = [
  'baca/products',
  'baca/categories',
  'baca/blog',
  'baca/gallery',
]

/** Type guard so we never cast through `as UploadFolder` without checking. */
function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value)
}

/**
 * Builds a short-lived Cloudinary upload signature. The API secret never leaves
 * the server. The signature pins `resource_type: image` so a caller can't sneak
 * a different asset type (raw/video) past the allowlisted folder check.
 */
export function createUploadSignature(folder: string): UploadSignature {
  if (!isCloudinaryConfigured) {
    throw badRequest(
      'Image upload is not configured (missing Cloudinary credentials)',
    )
  }
  if (!isUploadFolder(folder)) {
    throw badRequest('Invalid upload folder')
  }

  const timestamp = Math.round(Date.now() / 1000)
  // Pin resource_type into the signed params so the client can't upload a
  // non-image asset under our signature.
  const signedParams = {
    timestamp,
    folder,
    resource_type: 'image',
  }
  const signature = cloudinary.utils.api_sign_request(
    signedParams,
    serverEnvironment.CLOUDINARY_API_SECRET,
  )

  return {
    signature,
    timestamp,
    apiKey: serverEnvironment.CLOUDINARY_API_KEY,
    cloudName: serverEnvironment.CLOUDINARY_CLOUD_NAME,
    folder,
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
