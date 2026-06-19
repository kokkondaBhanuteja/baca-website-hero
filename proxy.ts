import createMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Run on all paths except API routes, the non-localized /admin area, Next
  // internals, and anything with a file extension (so `/images/*`, `/icon.svg`,
  // etc. are never rewritten).
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
}
