import 'server-only'

import { PrismaClient } from '@prisma/client'

/**
 * Singleton PrismaClient — reused across hot reloads in development so we don't
 * exhaust the connection pool. Server-only.
 */
const globalForPrisma = globalThis as unknown as {
  prismaClient?: PrismaClient
}

export const prisma =
  globalForPrisma.prismaClient ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaClient = prisma
}
