import { z } from 'zod'

import { optionalLocalizedText } from './localized-text-schema'

export const galleryImageInputSchema = z.object({
  caption: optionalLocalizedText.nullish(),
  imageUrl: z.string().min(1, 'An image is required'),
  imagePublicId: z.string().min(1, 'An image is required'),
  mediaType: z.enum(['PHOTO', 'VIDEO']).default('PHOTO'),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
})

export type GalleryImageInput = z.infer<typeof galleryImageInputSchema>
