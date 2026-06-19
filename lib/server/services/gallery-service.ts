import 'server-only'

import { Prisma, type GalleryImage } from '@prisma/client'
import { revalidateTag } from 'next/cache'

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

  await destroyUploadedImage(row.imagePublicId)
  await prisma.galleryImage.delete({ where: { id } })
  revalidateTag(GALLERY_TAG, 'max')
}

export async function listPublishedGallery(
  locale: Locale,
): Promise<GalleryImagePublicDto[]> {
  const rows = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return rows.map((row) => ({
    id: row.id,
    caption: localizedValue(row.caption as LocalizedText | null, locale),
    imageUrl: optimizedImageUrl(row.imageUrl) ?? row.imageUrl,
  }))
}
