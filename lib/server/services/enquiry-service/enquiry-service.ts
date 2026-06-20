import 'server-only'

import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { prisma } from '@/lib/server/prisma'
import type {
  EnquiryDto,
  EnquiryStatusValue,
} from '@/lib/shared/types/enquiry-dto'
import type { EnquiryInput } from '@/lib/server/validation/enquiry-schema'

type EnquiryRow = {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  message: string
  localeSent: string
  status: EnquiryStatusValue
  createdAt: Date
}

function map(row: EnquiryRow): EnquiryDto {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    phone: row.phone,
    message: row.message,
    localeSent: row.localeSent,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function createEnquiry(
  input: EnquiryInput,
): Promise<{ id: string }> {
  try {
    const row = await prisma.enquiry.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        company: input.company ?? null,
        phone: input.phone ?? null,
        message: input.message,
        localeSent: input.localeSent,
      },
    })
    return { id: row.id }
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function listEnquiries(): Promise<EnquiryDto[]> {
  const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(map)
}

export async function countNewEnquiries(): Promise<number> {
  return prisma.enquiry.count({ where: { status: 'NEW' } })
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatusValue,
): Promise<EnquiryDto> {
  try {
    const row = await prisma.enquiry.update({ where: { id }, data: { status } })
    return map(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}
