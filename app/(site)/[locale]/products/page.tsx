import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { getCategoriesForLocale } from '@/lib/server/services/category-service'
import { Eyebrow } from '@/components/ui/eyebrow'
import { MediaReveal } from '@/components/ui/media-reveal'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

// Always reflect the live catalogue (admin edits appear immediately).
export const dynamic = 'force-dynamic'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'productsPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('intro') }
}

export default async function ProductsPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('productsPage')
  const categories = await getCategoriesForLocale(locale as Locale)

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
          <h1 className="max-w-[20ch] text-balance font-heading text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.04] tracking-[-0.02em] text-ink">
            {t('heading')}
          </h1>
          <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-ink-60">
            {t('intro')}
          </p>

          {categories.length === 0 ? (
            <p className="mt-16 text-ink-60">{t('empty')}</p>
          ) : (
            <div className="mt-16 space-y-16">
              {categories.map((category) => (
                <div key={category.slug}>
                  <div className="mb-6 border-b border-line pb-4">
                    <h2 className="font-heading text-2xl font-light text-ink">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-60">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {category.products.map((product) => (
                      <article
                        key={product.id}
                        id={product.slug}
                        className="scroll-mt-header-offset overflow-hidden rounded-2xl border border-line bg-paper"
                      >
                        <MediaReveal className="aspect-[4/3]">
                          {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-bone" />
                          )}
                        </MediaReveal>
                        <div className="p-5">
                          <h3 className="font-heading text-lg font-light text-ink">
                            {product.name}
                          </h3>
                          {product.summary && (
                            <p className="mt-1 text-[13px] leading-relaxed text-ink-60">
                              {product.summary}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
