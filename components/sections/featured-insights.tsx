import { ArrowUpRight } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { listPublishedArticles } from '@/lib/server/services/blog-article-service'
import { BLOG_CATEGORY_KEY } from '@/lib/shared/types/blog-dto'
import { Eyebrow } from '@/components/ui/eyebrow'
import { MediaReveal } from '@/components/ui/media-reveal'
import { Reveal } from '@/components/ui/reveal'

export async function FeaturedInsights() {
  const locale = (await getLocale()) as Locale
  const t = await getTranslations('featuredInsights')
  const tBlogs = await getTranslations('blogsPage')

  const articles = (await listPublishedArticles(locale)).slice(0, 3)
  if (articles.length === 0) return null

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
            <h2 className="max-w-[18ch] text-balance font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
              {t('heading')}
            </h2>
          </div>
          <Link
            href={Route.Blogs}
            data-cursor="fill"
            className="group inline-flex items-center gap-2 self-end font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
          >
            {t('allArticles')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug} delay={index * 90}>
              <Link
                href={`${Route.Blogs}/${article.slug}`}
                className="group block"
              >
                <MediaReveal className="rounded-2xl border border-line">
                  {article.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="aspect-[16/11] w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="aspect-[16/11] w-full bg-bone" />
                  )}
                </MediaReveal>
                <div className="mt-5 flex items-center gap-3">
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-60">
                    {article.featured
                      ? tBlogs('featured')
                      : tBlogs(
                          `categories.${BLOG_CATEGORY_KEY[article.category]}` as Parameters<
                            typeof tBlogs
                          >[0],
                        )}
                  </span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-60">
                    {article.readMinutes} {tBlogs('minRead')}
                  </span>
                </div>
                <h3 className="mt-4 max-w-[28ch] text-balance font-heading text-xl font-light leading-snug text-ink transition-colors group-hover:text-clay">
                  {article.title}
                </h3>
                <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-ink-60">
                  {article.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
