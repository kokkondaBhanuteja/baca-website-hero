import { z } from 'zod'

import {
  requiredLocalizedText,
  slugField,
} from '@/lib/server/validation/localized-text-schema'

export const blogTypeInputSchema = z
  .object({
    slug: slugField,
    name: requiredLocalizedText,
    sortOrder: z.number().int().min(0).max(10000).default(0),
    isPublished: z.boolean().default(true),
  })
  .strict()

export type BlogTypeInput = z.infer<typeof blogTypeInputSchema>
