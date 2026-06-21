import { z } from 'zod'

import {
  requiredLocalizedText,
  slugField,
} from '@/lib/server/validation/localized-text-schema'

export const blogArticleInputSchema = z
  .object({
    slug: slugField,
    category: z.enum([
      'INDUSTRY_INSIGHTS',
      'IMPACT_STORIES',
      'COMMUNITY_ENGAGEMENT',
    ]),
    title: requiredLocalizedText,
    excerpt: requiredLocalizedText,
    body: requiredLocalizedText,
    coverImageUrl: z
      .string()
      .url('Cover image must be a valid URL')
      .max(2048)
      .nullish(),
    coverImagePublicId: z.string().max(255).nullish(),
    authorName: z.string().trim().max(120).nullish(),
    authorRole: z.string().trim().max(120).nullish(),
    authorAvatarUrl: z
      .string()
      .url('Author avatar must be a valid URL')
      .max(2048)
      .nullish(),
    authorAvatarPublicId: z.string().max(255).nullish(),
    readMinutes: z.number().int().min(1).max(120).default(3),
    status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
    featured: z.boolean().default(false),
  })
  .strict()

export type BlogArticleInput = z.infer<typeof blogArticleInputSchema>
