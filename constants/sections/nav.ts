import { Route } from '@/constants/routes'

export interface NavChild {
  /** Joins to `nav.items.<parentKey>.children.<key>` in messages. */
  key: string
  href: string
}

export interface NavItemConfig {
  /** Joins to `nav.items.<key>.label` in messages. */
  key: string
  href: string
  children?: NavChild[]
}

/**
 * Primary navigation. Early-stage: every item points at a real destination —
 * About scrolls to the "Why we're here" section on the home page (same page), the
 * rest route to live pages. (Gallery and sub-menus return once we have the
 * content to back them.)
 */
export const NAV: NavItemConfig[] = [
  { key: 'about', href: `${Route.Home}#why-we-re-here` },
  { key: 'products', href: Route.Products },
  { key: 'insights', href: Route.Blogs },
  { key: 'contact', href: Route.Contact },
]
