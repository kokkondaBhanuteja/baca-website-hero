import 'server-only'

import { z } from 'zod'

/**
 * Server-side environment, parsed and validated once on first import. Fails fast
 * at boot if a required secret is missing. Never import this from client code.
 */
const environmentSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  SEED_ADMIN_EMAIL: z.string().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
})

export const serverEnvironment = environmentSchema.parse(process.env)

/** Cloudinary is optional until the operator fills the credentials. */
export const isCloudinaryConfigured = Boolean(
  serverEnvironment.CLOUDINARY_CLOUD_NAME &&
  serverEnvironment.CLOUDINARY_API_KEY &&
  serverEnvironment.CLOUDINARY_API_SECRET,
)
