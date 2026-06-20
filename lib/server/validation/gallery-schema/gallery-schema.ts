import { z } from 'zod'

import { optionalLocalizedText } from '@/lib/server/validation/localized-text-schema'

export const galleryImageInputSchema = z
  .object({
    caption: optionalLocalizedText.nullish(),
    imageUrl: z
      .string()
      .url('Image URL must be a valid URL')
      .max(2048, 'Image URL is too long')
      .min(1, 'An image is required'),
    imagePublicId: z
      .string()
      .min(1, 'An image is required')
      .max(255, 'Image public id is too long'),
    mediaType: z.enum(['PHOTO', 'VIDEO']).default('PHOTO'),
    sortOrder: z.number().int().min(0).max(10000).default(0),
    isPublished: z.boolean().default(true),
  })
  .strict()

export type GalleryImageInput = z.infer<typeof galleryImageInputSchema>
