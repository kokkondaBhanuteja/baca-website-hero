import { z } from 'zod'

import { LOCALES } from '@/constants/i18n'

export const enquiryInputSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .max(200)
      .email('Enter a valid email address'),
    company: z.string().trim().max(160).nullish(),
    phone: z.string().trim().max(40).nullish(),
    message: z.string().trim().min(1, 'Message is required').max(4000),
    // localeSent must be one of the project's 7 supported locales so an attacker
    // can't store an arbitrary 5-char string in the admin inbox.
    localeSent: z.enum(LOCALES),
  })
  .strict()

export type EnquiryInput = z.infer<typeof enquiryInputSchema>

export const enquiryStatusSchema = z
  .object({
    status: z.enum(['NEW', 'READ', 'ARCHIVED']),
  })
  .strict()
