import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * Locale-aware navigation primitives. These are the ONLY way components should
 * link or navigate internally — they apply the `as-needed` locale prefix
 * automatically (so a `<Link href="/products">` renders `/de/products` under the
 * German locale, but `/products` under the default English one).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
