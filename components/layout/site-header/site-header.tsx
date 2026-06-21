import { getLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { listPublishedBlogTypes } from '@/lib/server/services/blog-type-service'
import { listPublishedProducts } from '@/lib/server/services/product-service'

import {
  SiteHeaderClient,
  type NavLink,
} from '@/components/layout/site-header/site-header-client'

/**
 * Server wrapper for the header — fetches the top 3 live products + the first 3
 * published blog types for the current locale and hands them to the interactive
 * client header, which renders them as the Products / Blogs dropdowns. Each blog
 * type links to the blogs page pre-filtered to that type (`/blogs?type=<slug>`).
 */
export async function SiteHeader({
  forceSolid = false,
}: {
  forceSolid?: boolean
}) {
  const locale = (await getLocale()) as Locale

  const [products, blogTypes] = await Promise.all([
    listPublishedProducts(locale, 3),
    listPublishedBlogTypes(locale),
  ])

  const productLinks: NavLink[] = products.map((product) => ({
    label: product.name,
    href: `${Route.Products}#${product.slug}`,
  }))

  const insightLinks: NavLink[] = blogTypes.slice(0, 3).map((blogType) => ({
    label: blogType.name,
    href: `${Route.Blogs}?type=${blogType.slug}`,
  }))

  return (
    <SiteHeaderClient
      forceSolid={forceSolid}
      productLinks={productLinks}
      insightLinks={insightLinks}
    />
  )
}
