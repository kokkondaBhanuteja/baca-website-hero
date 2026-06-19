import { Route } from '@/constants/routes'

export interface FooterLinkConfig {
  /** Joins to `footer.columns.<columnKey>.links.<key>` in messages. */
  key: string
  href: string
}

export interface FooterColumnConfig {
  /** Joins to `footer.columns.<key>.title` in messages. */
  key: string
  links: FooterLinkConfig[]
}

/**
 * Early-stage footer navigation — only live destinations. About/Approach/
 * Certifications scroll to their sections on the home page; the catalogue and
 * insights route to their pages.
 */
export const FOOTER_COLUMNS: FooterColumnConfig[] = [
  {
    key: 'products',
    links: [
      { key: 'spices', href: Route.Products },
      { key: 'all', href: Route.Products },
    ],
  },
  {
    key: 'company',
    links: [
      { key: 'about', href: `${Route.Home}#why-we-re-here` },
      { key: 'approach', href: `${Route.Home}#approach` },
    ],
  },
  {
    key: 'resources',
    links: [
      { key: 'insights', href: Route.Blogs },
      { key: 'certifications', href: `${Route.Home}#compliance` },
      { key: 'contact', href: Route.Contact },
      { key: 'catalogue', href: Route.Contact },
    ],
  },
]
