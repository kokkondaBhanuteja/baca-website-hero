/** Shared nav shape used by both desktop nav and mobile menu. */

export interface NavLink {
  label: string
  href: string
}

export interface NavItem {
  key: string
  label: string
  href: string
  children?: NavLink[]
}
