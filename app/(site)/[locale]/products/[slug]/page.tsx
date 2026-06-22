import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { getCategoriesForLocale } from '@/lib/server/services/category-service'
import {
  getPublishedProductBySlug,
  listRelatedProducts,
} from '@/lib/server/services/product-service'
import { CtaLink } from '@/components/ui/cta-link'
import { MarkdownContent } from '@/components/shared/markdown-content'
import { ProductGallery } from '@/components/shared/product-gallery'
import { SeasonalityCalendar } from '@/components/shared/seasonality-calendar'
import { CtaBand } from '@/components/sections/cta-band'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const dynamic = 'force-dynamic'

type PageParams = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getPublishedProductBySlug(slug, locale as Locale)
  if (!product) return { title: 'Product — BACA' }
  return {
    title: `${product.name} — BACA`,
    description: product.summary || product.description.slice(0, 160),
  }
}

export default async function ProductDetailPage({ params }: PageParams) {
  const { locale, slug } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('productsPage')

  const product = await getPublishedProductBySlug(slug, locale as Locale)
  if (!product) notFound()

  const [related, allCategories] = await Promise.all([
    listRelatedProducts(slug, locale as Locale),
    getCategoriesForLocale(locale as Locale),
  ])

  const hasSeasonality =
    product.peakMonths.length > 0 || product.harvestMonths.length > 0

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        {/* Thin brand-tone stripe at the very top (article-style chrome). */}
        <div className="h-[3px] w-full bg-forest/50" />

        <div className="mx-auto max-w-[1300px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px] lg:gap-12 xl:grid-cols-[1fr_340px] xl:gap-16">
            {/* MAIN article column ------------------------------------------ */}
            <article className="min-w-0 lg:border-r lg:border-line lg:pr-12 xl:pr-16">
              <Link
                href={Route.Products}
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-forest transition-colors hover:text-clay"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('detail.products')}
              </Link>

              <h1 className="mt-7 font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.04] tracking-[-0.02em] text-ink">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-ink-60">
                {product.botanicalName && (
                  <>
                    <span className="font-heading italic text-clay">
                      {product.botanicalName}
                    </span>
                    <span className="text-ink/30" aria-hidden>
                      |
                    </span>
                  </>
                )}
                <span>{product.categoryName}</span>
              </div>

              {product.images.length > 0 && (
                <div className="mt-9">
                  <ProductGallery images={product.images} alt={product.name} />
                </div>
              )}

              {product.summary && (
                <h2 className="mt-10 font-heading text-2xl font-light leading-snug text-ink">
                  {product.summary}
                </h2>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CtaLink href={Route.Contact} arrow>
                  {t('detail.requestQuote')}
                </CtaLink>
                <CtaLink href={Route.Contact} variant="outline">
                  {t('detail.requestSample')}
                </CtaLink>
              </div>

              {product.originRegions.length > 0 && (
                <section className="mt-10 border-t border-line pt-8">
                  <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
                    {t('detail.originRegions')}
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {product.originRegions.map((region) => (
                      <li
                        key={region}
                        className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink/75"
                      >
                        {region}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {product.specs.length > 0 && (
                <section className="mt-10 border-t border-line pt-8">
                  <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
                    {t('detail.specifications')}
                  </h3>
                  <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    {product.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-60">
                          {spec.label}
                        </dt>
                        <dd className="mt-1 text-[15px] leading-snug text-ink">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {hasSeasonality && (
                <section className="mt-10 border-t border-line pt-8">
                  <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
                    {t('detail.seasonality')}
                  </h3>
                  <p className="mb-4 mt-1 text-[12px] text-ink-60">
                    {t('detail.seasonalityHint')}
                  </p>
                  <SeasonalityCalendar
                    peakMonths={product.peakMonths}
                    harvestMonths={product.harvestMonths}
                    locale={locale as Locale}
                    harvestLabel={t('detail.harvest')}
                    peakLabel={t('detail.peak')}
                  />
                </section>
              )}

              {product.description && (
                <div className="mt-10 border-t border-line pt-10">
                  <MarkdownContent content={product.description} />
                </div>
              )}
            </article>

            {/* SIDEBAR ------------------------------------------------------- */}
            <aside className="min-w-0 lg:pt-1">
              {allCategories.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl font-medium text-ink">
                    {t('detail.categoriesHeading')}
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3.5">
                    {allCategories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={Route.Products}
                          className={cn(
                            'text-[15px] leading-snug transition-colors hover:text-clay',
                            category.slug === product.categorySlug
                              ? 'font-medium text-forest'
                              : 'text-ink/80',
                          )}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {related.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-heading text-2xl font-medium text-ink">
                    {t('detail.pairsNaturally')}
                  </h2>
                  <ul className="mt-5 flex flex-col gap-5">
                    {related.slice(0, 3).map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`${Route.Products}/${item.slug}`}
                          className="group flex items-start gap-3.5"
                        >
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="h-20 w-20 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-20 w-20 shrink-0 rounded-md bg-bone" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-medium leading-snug text-ink transition-colors group-hover:text-clay">
                              {item.name}
                            </p>
                            {item.summary && (
                              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-60">
                                {item.summary}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          </div>
        </div>

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  )
}
