import { Prisma } from '@prisma/client'

import { badRequest, conflictError, notFoundError } from './http-error'

/**
 * Translates known Prisma errors into clean `HttpError`s. Call from a service
 * catch block: `catch (error) { throw mapPrismaError(error) }`.
 */
export function mapPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') throw conflictError('That slug is already in use')
    if (error.code === 'P2003') throw badRequest('Referenced record does not exist')
    if (error.code === 'P2025') throw notFoundError('Record not found')
  }
  throw error
}
