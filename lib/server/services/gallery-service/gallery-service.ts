import 'server-only'

import { Prisma, type GalleryImage } from '@prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

import type { Locale } from '@/constants/i18n'
import { destroyUploadedImage } from '@/lib/server/cloudinary/sign-upload'
import { notFoundError } from '@/lib/server/http/http-error'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { localizedValue } from '@/lib/server/localization/localized-value'
import { prisma } from '@/lib/server/prisma'
import { optimizedImageUrl } from '@/lib/shared/cloudinary-url'
import type {
  GalleryImageAdminDto,
  GalleryImagePublicDto,
} from '@/lib/shared/types/gallery-dto'
import type { LocalizedText } from '@/lib/shared/types/localized-text'
import type { GalleryImageInput } from '@/lib/server/validation/gallery-schema'

export const GALLERY_TAG = 'gallery'

function mapAdmin(row: GalleryImage): GalleryImageAdminDto {
  return {
    id: row.id,
    caption: (row.caption as LocalizedText | null) ?? null,
    imageUrl: row.imageUrl,
    imagePublicId: row.imagePublicId,
    mediaType: row.mediaType,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  }
}

export async function listGalleryForAdmin(): Promise<GalleryImageAdminDto[]> {
  const rows = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return rows.map(mapAdmin)
}

export async function createGalleryImage(
  input: GalleryImageInput,
): Promise<GalleryImageAdminDto> {
  try {
    const row = await prisma.galleryImage.create({
      data: {
        caption: input.caption
          ? (input.caption as Prisma.InputJsonValue)
          : Prisma.DbNull,
        imageUrl: input.imageUrl,
        imagePublicId: input.imagePublicId,
        mediaType: input.mediaType,
        sortOrder: input.sortOrder,
        isPublished: input.isPublished,
      },
    })
    revalidateTag(GALLERY_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const row = await prisma.galleryImage.findUnique({ where: { id } })
  if (!row) throw notFoundError('Image not found')

  // Delete the DB row first; only destroy the Cloudinary asset after success
  // so a transient prisma error doesn't orphan the image.
  try {
    await prisma.galleryImage.delete({ where: { id } })
  } catch (error) {
    return mapPrismaError(error)
  }
  revalidateTag(GALLERY_TAG, 'max')
  if (row.imagePublicId) {
    await destroyUploadedImage(row.imagePublicId)
  }
}

/**
 * Cached + tagged so `revalidateTag(GALLERY_TAG, 'max')` (fired by every
 * mutation) actually invalidates this entry for SSG / cached consumers.
 */
export const listPublishedGallery = unstable_cache(
  async (locale: Locale): Promise<GalleryImagePublicDto[]> => {
    const rows = await prisma.galleryImage.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return rows.map((row) => ({
      id: row.id,
      caption: localizedValue(row.caption as LocalizedText | null, locale),
      imageUrl: optimizedImageUrl(row.imageUrl) ?? row.imageUrl,
    }))
  },
  ['listPublishedGallery'],
  { tags: [GALLERY_TAG] },
)
