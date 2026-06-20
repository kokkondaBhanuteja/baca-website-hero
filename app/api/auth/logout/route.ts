import { cookies } from 'next/headers'

import { SESSION_COOKIE_NAME } from '@/lib/server/auth/session'
import { handleRoute } from '@/lib/server/http/handle-route'
import { noContent } from '@/lib/server/http/respond'

export const POST = handleRoute(async () => {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  return noContent()
})
