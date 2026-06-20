import 'server-only'

import { sendEnquiryNotification } from '@/lib/server/email'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { prisma } from '@/lib/server/prisma'
import type { EnquiryInput } from '@/lib/server/validation/enquiry-schema'

export async function createEnquiry(
  input: EnquiryInput,
): Promise<{ id: string }> {
  const normalised = {
    name: input.name,
    email: input.email.toLowerCase(),
    company: input.company ?? null,
    phone: input.phone ?? null,
    message: input.message,
    localeSent: input.localeSent,
  }

  let id: string
  try {
    const row = await prisma.enquiry.create({ data: normalised })
    id = row.id
  } catch (error) {
    return mapPrismaError(error)
  }

  // Best-effort SMTP notification. The function swallows its own errors and
  // returns `false`, so we never fail the form submission because of email
  // trouble — the DB row is the source of truth.
  await sendEnquiryNotification(normalised)

  return { id }
}
