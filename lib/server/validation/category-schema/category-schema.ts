import { z } from 'zod'

import {
  optionalLocalizedText,
  requiredLocalizedText,
  slugField,
} from '@/lib/server/validation/localized-text-schema'

export const categoryInputSchema = z
  .object({
    slug: slugField,
    name: requiredLocalizedText,
    description: optionalLocalizedText.nullish(),
    imageUrl: z
      .string()
      .url('Image URL must be a valid URL')
      .max(2048)
      .nullish(),
    imagePublicId: z.string().max(255).nullish(),
    sortOrder: z.number().int().min(0).max(10000).default(0),
    isPublished: z.boolean().default(true),
  })
  .strict()

export type CategoryInput = z.infer<typeof categoryInputSchema>
