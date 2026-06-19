import 'server-only'

import { unauthorized } from '@/lib/server/http/http-error'
import type { AdminUserDto } from '@/lib/shared/types/admin-user-dto'

import { getCurrentAdmin } from './session'

/** API guard — returns the admin or throws a 401 `HttpError`. */
export async function requireAdmin(): Promise<AdminUserDto> {
  const admin = await getCurrentAdmin()
  if (!admin) throw unauthorized('Admin authentication required')
  return admin
}
