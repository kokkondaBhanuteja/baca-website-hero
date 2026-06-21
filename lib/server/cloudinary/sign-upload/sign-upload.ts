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
  'baca/authors',
  'baca/gallery',
]

/** Type guard so we never cast through `as UploadFolder` without checking. */
function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value)
}

/**
 * Builds a short-lived Cloudinary upload signature. The API secret never leaves
 * the server. The upload destination is constrained because `folder` is signed
 * (and allow-listed), and image-only is enforced by the `/image/upload` endpoint.
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
  // Sign ONLY the params Cloudinary includes when it verifies an upload.
  // Cloudinary excludes `resource_type` (along with `file`, `cloud_name` and
  // `api_key`) from its signature — but the SDK's api_sign_request would still
  // sign it, so including it makes our signature disagree with Cloudinary's and
  // fails every upload with "401 Invalid Signature". Image-only is already
  // enforced by the `/image/upload` endpoint, and the destination is locked
  // because `folder` is signed.
  const signedParams = {
    timestamp,
    folder,
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
