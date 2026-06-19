import { z } from 'zod'

import {
  optionalLocalizedText,
  requiredLocalizedText,
  slugField,
} from './localized-text-schema'

export const productInputSchema = z.object({
  slug: slugField,
  categoryId: z.string().min(1, 'Category is required'),
  name: requiredLocalizedText,
  summary: optionalLocalizedText.nullish(),
  description: optionalLocalizedText.nullish(),
  imageUrl: z.string().nullish(),
  imagePublicId: z.string().nullish(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
})

export type ProductInput = z.infer<typeof productInputSchema>
