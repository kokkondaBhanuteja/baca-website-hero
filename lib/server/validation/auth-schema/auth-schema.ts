import { z } from 'zod'

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .max(254)
      .email('Enter a valid email address'),
    // Cap password length to prevent argon2 DoS via huge bodies. Practical max
    // is well below 1024; argon2 happily hashes anything but the work scales.
    password: z.string().min(1, 'Password is required').max(1024),
  })
  .strict()

export type LoginInput = z.infer<typeof loginSchema>
