import { redirect } from 'next/navigation'

/**
 * Root-level 404. Fires for unmatched paths that resolve OUTSIDE any locale
 * segment (e.g. `/login` or `/foo` typed directly into the address bar).
 *
 * Why a redirect to `/` and not custom UI:
 *
 *   1. This project intentionally has no `app/layout.tsx` — two root layouts
 *      live inside route groups (`(site)/[locale]` and `(admin)/admin`).
 *   2. A root `not-found.tsx` that returns JSX without a sibling root layout
 *      has to ship its own `<html>` + `<body>`. Next.js's dev-mode
 *      `DefaultLayout` injects another bare `<html>` + `<body>` wrapper for
 *      hot reloading → nested html/body → hydration mismatch warning that
 *      `suppressHydrationWarning` cannot fully silence.
 *   3. Redirecting to a non-existent path like `/404` looped infinitely:
 *      `/404` also has no locale prefix, lands here again, redirects again.
 *
 * So we redirect to `/` (home), which is a real page that always exists.
 * The localised, rich 404 (`(site)/[locale]/not-found.tsx`) still fires for
 * any unmatched path WITHIN a locale segment — the common case. This file is
 * a safety net for the rarer top-level unmatched paths.
 */
export default function RootNotFound() {
  redirect('/')
}
