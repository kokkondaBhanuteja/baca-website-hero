import { Prisma } from '@prisma/client'

import {
  badRequest,
  conflictError,
  notFoundError,
} from '@/lib/server/http/http-error'

/**
 * Translates known Prisma errors into clean `HttpError`s. Call from a service
 * catch block: `catch (error) { return mapPrismaError(error) }`.
 *
 * Covers the codes the project actually hits today. Add new ones here rather
 * than letting an unhandled prisma error fall through to a 500 — the latter
 * leaks information and gives the admin no actionable response code.
 */
export function mapPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // unique constraint
        throw conflictError('That value is already in use')
      case 'P2003':
        // foreign-key constraint
        throw badRequest('Referenced record does not exist')
      case 'P2014':
        // required relation violation
        throw badRequest(
          'This change would violate a required relationship between records',
        )
      case 'P2025':
        // record not found (e.g. concurrent delete during update)
        throw notFoundError('Record not found')
      case 'P2034':
        // transaction conflict (write-skew); transient — surface as 409 so the
        // admin retries instead of seeing a generic 500.
        throw conflictError('Concurrent edit conflict — please retry')
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    throw badRequest('Invalid data for this record')
  }
  throw error
}
