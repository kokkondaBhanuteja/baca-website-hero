import { z } from 'zod'

import {
  optionalLocalizedText,
  requiredLocalizedText,
  slugField,
} from './localized-text-schema'

export const categoryInputSchema = z.object({
  slug: slugField,
  name: requiredLocalizedText,
  description: optionalLocalizedText.nullish(),
  imageUrl: z.string().nullish(),
  imagePublicId: z.string().nullish(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
})

export type CategoryInput = z.infer<typeof categoryInputSchema>
