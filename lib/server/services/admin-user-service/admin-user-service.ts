import 'server-only'

import { verifyPassword } from '@/lib/server/auth/password'
import { unauthorized } from '@/lib/server/http/http-error'
import { prisma } from '@/lib/server/prisma'
import type { AdminUserDto } from '@/lib/shared/types/admin-user-dto'

/**
 * Verifies admin credentials. Returns a generic 401 for both unknown-email and
 * wrong-password so the endpoint can't be used to enumerate accounts.
 */
export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminUserDto> {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  })
  if (!admin) throw unauthorized('Invalid email or password')

  const passwordMatches = await verifyPassword(admin.passwordHash, password)
  if (!passwordMatches) throw unauthorized('Invalid email or password')

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  }
}
