import { z } from 'zod'

import {
  optionalLocalizedText,
  requiredLocalizedText,
  slugField,
} from '@/lib/server/validation/localized-text-schema'

export const productInputSchema = z
  .object({
    slug: slugField,
    // categoryId must be a 24-128 char id (covers cuid / uuid / cuid2 shapes
    // without locking the project into one id strategy).
    categoryId: z
      .string()
      .trim()
      .min(1, 'Category is required')
      .max(128, 'Invalid category id'),
    name: requiredLocalizedText,
    summary: optionalLocalizedText.nullish(),
    description: optionalLocalizedText.nullish(),
    botanicalName: z.string().trim().max(160).nullish(),
    originRegions: z.array(z.string().trim().min(1).max(120)).max(20).nullish(),
    specs: z
      .array(
        z.object({
          label: z.string().trim().min(1).max(60),
          value: z.string().trim().min(1).max(200),
        }),
      )
      .max(30)
      .nullish(),
    harvestMonths: z.array(z.number().int().min(1).max(12)).max(12).nullish(),
    peakMonths: z.array(z.number().int().min(1).max(12)).max(12).nullish(),
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

export type ProductInput = z.infer<typeof productInputSchema>
