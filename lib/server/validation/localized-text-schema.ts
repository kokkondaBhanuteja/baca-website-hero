import { z } from 'zod'

/**
 * JSONB localized field validators. English is required on `required…`; every
 * other locale is optional (falls back to English at read time).
 */
export const requiredLocalizedText = z.object({
  en: z.string().trim().min(1, 'English is required'),
  ar: z.string().trim().optional(),
  de: z.string().trim().optional(),
  fr: z.string().trim().optional(),
  es: z.string().trim().optional(),
  nl: z.string().trim().optional(),
  it: z.string().trim().optional(),
})

export const optionalLocalizedText = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
  de: z.string().trim().optional(),
  fr: z.string().trim().optional(),
  es: z.string().trim().optional(),
  nl: z.string().trim().optional(),
  it: z.string().trim().optional(),
})

export const slugField = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only')
