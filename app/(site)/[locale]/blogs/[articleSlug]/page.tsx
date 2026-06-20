import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import {
  getPublishedArticleBySlug,
  listRelatedArticles,
} from '@/lib/server/services/blog-article-service'
import { BLOG_CATEGORY_KEY } from '@/lib/shared/types/blog-dto'
import { MediaReveal } from '@/components/ui/media-reveal'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const dynamic = 'force-dynamic'

type PageParams = { params: Promise<{ locale: string; articleSlug: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale, articleSlug } = await params
  const article = await getPublishedArticleBySlug(articleSlug, locale as Locale)
  if (!article) return { title: 'Article — BACA' }
  return { title: `${article.title} — BACA`, description: article.excerpt }
}

export default async function BlogArticlePage({ params }: PageParams) {
  const { locale, articleSlug } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('blogsPage')

  const article = await getPublishedArticleBySlug(articleSlug, locale as Locale)
  if (!article) notFound()

  const related = await listRelatedArticles(articleSlug, locale as Locale)
  const paragraphs = article.body
    .split(/\n{2,}/)
    .filter((block) => block.trim())

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <article className="mx-auto max-w-[760px] px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
          <Link
            href={Route.Blogs}
            className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-60 hover:text-clay"
          >
            ← {t('allArticles')}
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-60">
            <span className="rounded-full border border-line px-3 py-1">
              {t(
                `categories.${BLOG_CATEGORY_KEY[article.category]}` as Parameters<
                  typeof t
                >[0],
              )}
            </span>
            <span>
              {article.readMinutes} {t('minRead')}
            </span>
          </div>

          <h1 className="mt-5 text-balance font-heading text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-ink">
            {article.title}
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-60">
            {article.excerpt}
          </p>

          {article.coverImageUrl && (
            <MediaReveal className="mt-10 aspect-[16/9] rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </MediaReveal>
          )}

          <div className="mt-10 space-y-5 text-[16px] leading-relaxed text-ink/85">
            {paragraphs.map((block, index) => (
              <p key={index}>{block}</p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-line bg-cream">
            <div className="mx-auto max-w-content px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
              <h2 className="mb-8 font-heading text-2xl font-light text-ink">
                {t('related')}
              </h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`${Route.Blogs}/${item.slug}`}
                    className="group block"
                  >
                    <MediaReveal className="rounded-2xl border border-line">
                      {item.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="aspect-[16/11] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="aspect-[16/11] w-full bg-bone" />
                      )}
                    </MediaReveal>
                    <h3 className="mt-4 font-heading text-lg font-light leading-snug text-ink transition-colors group-hover:text-clay">
                      {item.title}
                    </h3>
                  </Link>
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
