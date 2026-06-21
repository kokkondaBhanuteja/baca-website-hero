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
    // Required free-text country. Not persisted to the DB (the Enquiry table
    // doesn't carry a country column) — only surfaced in the notification email
    // so the BACA team knows the buyer's origin before replying.
    country: z
      .string()
      .trim()
      .min(1, 'Country is required')
      .max(80, 'Country is too long'),
    // Hard-capped at 200 to match the client-side counter + textarea maxLength.
    // The cap is enforced server-side too so a tampered client can't sneak in
    // a longer message.
    message: z
      .string()
      .trim()
      .min(1, 'Message is required')
      .max(200, 'Message must be 200 characters or fewer'),
    // localeSent must be one of the project's 7 supported locales so an attacker
    // can't store an arbitrary 5-char string in the admin inbox.
    localeSent: z.enum(LOCALES),
  })
  .strict()

export type EnquiryInput = z.infer<typeof enquiryInputSchema>
