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
 * Primary navigation. Every item points at a real destination. The top nav
 * uses "Home" as a quick return to the root since there is no separate
 * /about page today (the footer still carries an "About" link that anchors
 * to the manifesto section `#why-we-re-here`).
 */
export const NAV: NavItemConfig[] = [
  { key: 'home', href: Route.Home },
  { key: 'products', href: Route.Products },
  { key: 'insights', href: Route.Blogs },
  { key: 'contact', href: Route.Contact },
]
