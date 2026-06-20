import { cookies } from 'next/headers'

import { signSessionToken } from '@/lib/server/auth/jwt'
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/server/auth/session'
import { handleRoute } from '@/lib/server/http/handle-route'
import { ok } from '@/lib/server/http/respond'
import { authenticateAdmin } from '@/lib/server/services/admin-user-service'
import { loginSchema } from '@/lib/server/validation/auth-schema'

export const POST = handleRoute(async (request) => {
  const { email, password } = loginSchema.parse(await request.json())
  const admin = await authenticateAdmin(email, password)

  const token = await signSessionToken({ adminId: admin.id, role: admin.role })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return ok(admin)
})
