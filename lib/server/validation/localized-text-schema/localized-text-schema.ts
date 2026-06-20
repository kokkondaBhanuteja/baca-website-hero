import { z } from 'zod'

/**
 * JSONB localized field validators. English is required on `required…`; every
 * other locale is optional (falls back to English at read time).
 *
 * Per-field max length of 16 000 characters caps the worst-case JSON body at
 * ~7 locales × 16 KB ≈ 112 KB per translatable field — comfortable for blog
 * article bodies, well below memory-pressure thresholds. Adjust per field with
 * `requiredLocalizedText.extend({ … })` if a specific entity needs different limits.
 */
const LOCALIZED_MAX_LENGTH = 16_000

export const requiredLocalizedText = z.object({
  en: z.string().trim().min(1, 'English is required').max(LOCALIZED_MAX_LENGTH),
  ar: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  de: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  fr: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  es: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  nl: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  it: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
})

export const optionalLocalizedText = z.object({
  en: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  ar: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  de: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  fr: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  es: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  nl: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
  it: z.string().trim().max(LOCALIZED_MAX_LENGTH).optional(),
})

export const slugField = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .max(120, 'Slug is too long')
  .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only')
