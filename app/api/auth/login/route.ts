import { cookies } from 'next/headers'

import { getClientIp } from '@/lib/server/auth/client-ip'
import { rateLimit } from '@/lib/server/auth/rate-limit'
import { signSessionToken } from '@/lib/server/auth/jwt'
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/server/auth/session'
import { HttpError } from '@/lib/server/http/http-error'
import { handleRoute } from '@/lib/server/http/handle-route'
import { ok } from '@/lib/server/http/respond'
import { authenticateAdmin } from '@/lib/server/services/admin-user-service'
import { loginSchema } from '@/lib/server/validation/auth-schema'

const LOGIN_RATE_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 }

export const POST = handleRoute(async (request) => {
  const ip = await getClientIp()
  const limit = rateLimit(`login:${ip}`, LOGIN_RATE_LIMIT)
  if (!limit.ok) {
    throw new HttpError(
      429,
      'RATE_LIMITED',
      `Too many login attempts. Try again in ${limit.retryAfterSeconds} seconds.`,
    )
  }

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
