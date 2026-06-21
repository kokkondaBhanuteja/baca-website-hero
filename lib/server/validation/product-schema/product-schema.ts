import { z } from 'zod'

import {
  optionalLocalizedText,
  requiredLocalizedText,
  slugField,
} from '@/lib/server/validation/localized-text-schema'

// An image reference is either an absolute http(s) URL (Cloudinary uploads) or a
// root-relative path (/images/… — local/seed assets). Cloudinary uploads pass
// `.url()`, but seeded products store local paths that must round-trip on edit.
const imageReference = z
  .string()
  .max(2048)
  .refine(
    (value) => /^https?:\/\//.test(value) || value.startsWith('/'),
    'Image URL must be a valid URL or a /path',
  )

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
    imageUrl: imageReference.nullish(),
    imagePublicId: z.string().max(255).nullish(),
    // Gallery images shown as a carousel. The server derives the cover
    // (imageUrl/imagePublicId) from images[0], so the form only sends this.
    images: z
      .array(
        z.object({
          url: imageReference,
          publicId: z.string().min(1).max(255),
        }),
      )
      .max(12)
      .nullish(),
    sortOrder: z.number().int().min(0).max(10000).default(0),
    isPublished: z.boolean().default(true),
  })
  .strict()

export type ProductInput = z.infer<typeof productInputSchema>
