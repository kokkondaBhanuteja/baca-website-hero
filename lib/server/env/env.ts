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
  // SMTP — all optional. When fully configured, public enquiries are emailed
  // to ENQUIRY_NOTIFY_TO on submit; otherwise the email send is skipped and
  // only the DB row is written.
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default(''),
  ENQUIRY_NOTIFY_TO: z.string().optional().default(''),
})

export const serverEnvironment = environmentSchema.parse(process.env)

/** Cloudinary is optional until the operator fills the credentials. */
export const isCloudinaryConfigured = Boolean(
  serverEnvironment.CLOUDINARY_CLOUD_NAME &&
  serverEnvironment.CLOUDINARY_API_KEY &&
  serverEnvironment.CLOUDINARY_API_SECRET,
)

/**
 * SMTP is optional. When false, the enquiry-notification email send is skipped
 * (the DB row is still written). Requires host + user + password + from + to.
 */
export const isSmtpConfigured = Boolean(
  serverEnvironment.SMTP_HOST &&
  serverEnvironment.SMTP_USER &&
  serverEnvironment.SMTP_PASSWORD &&
  serverEnvironment.SMTP_FROM &&
  serverEnvironment.ENQUIRY_NOTIFY_TO,
)
