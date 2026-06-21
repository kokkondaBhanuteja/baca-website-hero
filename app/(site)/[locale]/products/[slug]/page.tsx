import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import {
  getPublishedProductBySlug,
  listRelatedProducts,
} from '@/lib/server/services/product-service'
import { CtaLink } from '@/components/ui/cta-link'
import { MarkdownContent } from '@/components/shared/markdown-content'
import { ProductCard } from '@/components/shared/product-card'
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

  const related = await listRelatedProducts(slug, locale as Locale)
  const hasSeasonality =
    product.peakMonths.length > 0 || product.harvestMonths.length > 0
  const hasStructured =
    Boolean(product.botanicalName) ||
    product.originRegions.length > 0 ||
    product.specs.length > 0 ||
    hasSeasonality

  const breadcrumb = (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-60"
    >
      <Link href={Route.Home} className="hover:text-clay">
        {t('detail.home')}
      </Link>
      <span aria-hidden>/</span>
      <Link href={Route.Products} className="hover:text-clay">
        {t('detail.products')}
      </Link>
      <span aria-hidden>/</span>
      <span className="text-ink">{product.name}</span>
    </nav>
  )

  const heading = (
    <>
      <h1 className="font-heading text-[clamp(2.4rem,5vw,3.75rem)] font-light leading-[1.02] tracking-[-0.02em] text-ink">
        {product.name}
      </h1>
      {product.botanicalName && (
        <p className="mt-2 font-heading text-lg italic text-clay">
          {product.botanicalName}
        </p>
      )}
      {product.summary && (
        <p className="mt-6 text-pretty text-[17px] leading-relaxed text-ink/80">
          {product.summary}
        </p>
      )}
    </>
  )

  const ctaRow = (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <CtaLink href={Route.Contact} arrow>
        {t('detail.requestQuote')}
      </CtaLink>
      <CtaLink href={Route.Contact} variant="outline">
        {t('detail.requestSample')}
      </CtaLink>
    </div>
  )

  const structuredSections = hasStructured ? (
    <>
      {product.originRegions.length > 0 && (
        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
            {t('detail.originRegions')}
          </h2>
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
          <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
            {t('detail.specifications')}
          </h2>
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
          <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
            {t('detail.seasonality')}
          </h2>
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
    </>
  ) : null

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        {/* Single column: heading on top, image carousel below, then details */}
        <div className="mx-auto max-w-[800px] px-5 pt-[clamp(2rem,4vw,3.5rem)] sm:px-8">
          {breadcrumb}
          <div className="mt-8">{heading}</div>

          {product.images.length > 0 && (
            <div className="mt-9">
              <ProductGallery images={product.images} alt={product.name} />
            </div>
          )}

          {ctaRow}
          {structuredSections}
        </div>

        {/* Details — admin-pasted Markdown (narrative + specs table) */}
        {product.description && (
          <section className="mx-auto max-w-[800px] px-5 pb-[clamp(3rem,6vw,5rem)] pt-[clamp(2rem,4vw,3rem)] sm:px-8">
            <MarkdownContent content={product.description} />
          </section>
        )}

        {related.length > 0 && (
          <section className="border-t border-line bg-cream">
            <div className="mx-auto max-w-content px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="font-heading text-2xl font-light text-ink">
                  {t('detail.pairsNaturally')}
                </h2>
                <Link
                  href={Route.Products}
                  className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-60 hover:text-clay"
                >
                  {t('detail.viewAllProducts')} →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaBand />
      </main>
      <SiteFooter />
    </>
  )
}
