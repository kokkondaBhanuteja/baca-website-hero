import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { listPublishedArticles } from '@/lib/server/services/blog-article-service'
import {
  BLOG_CATEGORY_KEY,
  type BlogArticleSummaryDto,
} from '@/lib/shared/types/blog-dto'
import { MediaReveal } from '@/components/ui/media-reveal'
import { PageIntro } from '@/components/shared/page-intro'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const dynamic = 'force-dynamic'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'blogsPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('intro') }
}

export default async function BlogsPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('blogsPage')
  const articles = await listPublishedArticles(locale as Locale)

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <PageIntro
            eyebrow={t('eyebrow')}
            heading={t('heading')}
            intro={t('intro')}
          />

          {articles.length === 0 ? (
            <p className="mt-16 text-ink-60">{t('empty')}</p>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  categoryLabel={t(
                    `categories.${BLOG_CATEGORY_KEY[article.category]}` as Parameters<
                      typeof t
                    >[0],
                  )}
                  minReadLabel={t('minRead')}
                  featuredLabel={t('featured')}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

function ArticleCard({
  article,
  categoryLabel,
  minReadLabel,
  featuredLabel,
}: {
  article: BlogArticleSummaryDto
  categoryLabel: string
  minReadLabel: string
  featuredLabel: string
}) {
  return (
    <Link href={`${Route.Blogs}/${article.slug}`} className="group block">
      <MediaReveal className="rounded-2xl border border-line">
        {article.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="aspect-[16/11] w-full object-cover transition-transform duration-baca-fast ease-baca group-hover:scale-[1.06]"
          />
        ) : (
          <div className="aspect-[16/11] w-full bg-bone" />
        )}
      </MediaReveal>
      <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-60">
        <span className="rounded-full border border-line px-3 py-1">
          {article.featured ? featuredLabel : categoryLabel}
        </span>
        <span>
          {article.readMinutes} {minReadLabel}
        </span>
      </div>
      <h2 className="mt-4 max-w-[28ch] text-balance font-heading text-xl font-light leading-snug text-ink transition-colors group-hover:text-clay">
        {article.title}
      </h2>
      <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-ink-60">
        {article.excerpt}
      </p>
    </Link>
  )
}
