import 'server-only'

import { cookies } from 'next/headers'

import { prisma } from '@/lib/server/prisma'
import type { AdminUserDto } from '@/lib/shared/types/admin-user-dto'

import { verifySessionToken } from './jwt'

export const SESSION_COOKIE_NAME = 'baca_admin_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

/** Reads the session cookie and returns the current admin, or null. */
export async function getCurrentAdmin(): Promise<AdminUserDto | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  const payload = await verifySessionToken(token)
  if (!payload) return null

  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.adminId },
  })
  if (!admin) return null

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
}
