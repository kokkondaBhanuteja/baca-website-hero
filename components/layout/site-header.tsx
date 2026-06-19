import { getLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { listPublishedArticles } from '@/lib/server/services/blog-article-service'
import { listPublishedProducts } from '@/lib/server/services/product-service'

import { SiteHeaderClient, type NavLink } from './site-header-client'

/**
 * Server wrapper for the header — fetches the top 3 live products + insights for
 * the current locale and hands them to the interactive client header, which
 * renders them as the Products / Insights dropdowns.
 */
export async function SiteHeader({ forceSolid = false }: { forceSolid?: boolean }) {
  const locale = (await getLocale()) as Locale

  const [products, articles] = await Promise.all([
    listPublishedProducts(locale, 3),
    listPublishedArticles(locale),
  ])

  const productLinks: NavLink[] = products.map((product) => ({
    label: product.name,
    href: `${Route.Products}#${product.slug}`,
  }))

  const insightLinks: NavLink[] = articles.slice(0, 3).map((article) => ({
    label: article.title,
    href: `${Route.Blogs}/${article.slug}`,
  }))

  return (
    <SiteHeaderClient
      forceSolid={forceSolid}
      productLinks={productLinks}
      insightLinks={insightLinks}
    />
  )
}
