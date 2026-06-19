import { z } from 'zod'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const enquiryInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(200)
    .refine((value) => emailPattern.test(value), 'Enter a valid email address'),
  company: z.string().trim().max(160).nullish(),
  phone: z.string().trim().max(40).nullish(),
  message: z.string().trim().min(1, 'Message is required').max(4000),
  localeSent: z.string().trim().min(2).max(5),
})

export type EnquiryInput = z.infer<typeof enquiryInputSchema>

export const enquiryStatusSchema = z.object({
  status: z.enum(['NEW', 'READ', 'ARCHIVED']),
})
