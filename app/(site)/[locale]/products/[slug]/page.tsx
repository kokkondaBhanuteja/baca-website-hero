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
import { ProductCard } from '@/components/shared/product-card'
import { MediaHero } from '@/components/shared/media-hero'
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
  const paragraphs = product.description
    .split(/\n{2,}/)
    .filter((block) => block.trim())

  const attributes = [
    { label: t('detail.originRegions'), value: product.origin, hint: '' },
    {
      label: t('detail.specifications'),
      value: product.specifications,
      hint: '',
    },
    {
      label: t('detail.seasonality'),
      value: product.seasonality,
      hint: t('detail.seasonalityHint'),
    },
  ].filter((attribute) => attribute.value)

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-paper">
        <MediaHero
          imageUrl={product.imageUrl}
          imageAlt={product.name}
          eyebrow={product.categoryName}
          title={product.name}
        >
          {product.summary && (
            <p className="max-w-[56ch] text-[15px] leading-relaxed text-paper/80">
              {product.summary}
            </p>
          )}
        </MediaHero>

        <section className="mx-auto max-w-[860px] px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
          <Link
            href={Route.Products}
            className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-60 hover:text-clay"
          >
            ← {t('detail.backToProducts')}
          </Link>

          {paragraphs.length > 0 && (
            <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-ink/85">
              {paragraphs.map((block, index) => (
                <p key={index}>{block}</p>
              ))}
            </div>
          )}

          {attributes.length > 0 && (
            <dl className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
              {attributes.map((attribute) => (
                <div key={attribute.label}>
                  <dt className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-60">
                    {attribute.label}
                  </dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink/85">
                    {attribute.value}
                  </dd>
                  {attribute.hint && (
                    <p className="mt-1 text-[12px] text-ink-60">
                      {attribute.hint}
                    </p>
                  )}
                </div>
              ))}
            </dl>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <CtaLink href={Route.Contact} arrow>
              {t('detail.requestQuote')}
            </CtaLink>
            <CtaLink href={Route.Contact} variant="outline">
              {t('detail.requestSample')}
            </CtaLink>
          </div>
        </section>

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
      </main>
      <SiteFooter />
    </>
  )
}
