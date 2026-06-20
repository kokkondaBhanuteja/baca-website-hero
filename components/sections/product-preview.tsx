import { ArrowRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { getCategoriesForLocale } from '@/lib/server/services/category-service'
import { Eyebrow } from '@/components/ui/eyebrow'
import { MediaReveal } from '@/components/ui/media-reveal'
import { Reveal } from '@/components/ui/reveal'

export async function ProductPreview() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('productPreview')
  const tHero = await getTranslations('hero')

  const categories = await getCategoriesForLocale(locale)
  if (categories.length === 0) return null

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal className="mb-12 max-w-[44ch]">
          <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
          <h2 className="text-balance font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
            {t('heading')}
          </h2>
        </Reveal>

        {/* A feature row per category — reads as an intentional showcase whether
            there's one category or several. */}
        <div className="space-y-6">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 90}>
              <Link
                href={Route.Products}
                className="group grid overflow-hidden rounded-3xl border border-line bg-paper lg:grid-cols-2"
              >
                <MediaReveal className="relative aspect-[16/11] lg:aspect-auto lg:min-h-[440px]">
                  {category.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-bone" />
                  )}
                </MediaReveal>

                <div className="flex flex-col justify-center gap-7 p-8 sm:p-12">
                  <div>
                    <h3 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-light leading-[1.05] text-ink">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-60">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {category.products.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {category.products.map((product) => (
                        <li
                          key={product.id}
                          className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink/75"
                        >
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  )}

                  <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors group-hover:text-clay">
                    {tHero('ctaProducts')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
