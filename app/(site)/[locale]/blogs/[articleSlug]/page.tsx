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
import { formatPublishedDate } from '@/lib/shared/format-date'
import { MediaReveal } from '@/components/ui/media-reveal'
import { MediaHero } from '@/components/shared/media-hero'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const dynamic = 'force-dynamic'

// Byline fallback when an article has no explicit author.
const DEFAULT_AUTHOR = { name: 'BACA Team', role: '' }

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

  const authorName = article.authorName ?? DEFAULT_AUTHOR.name
  const authorRole = article.authorRole ?? DEFAULT_AUTHOR.role
  const authorInitial = authorName.charAt(0).toUpperCase()
  const publishedDate = formatPublishedDate(
    article.publishedAt,
    locale as Locale,
  )
  const categoryLabel = article.blogType.name

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-paper">
        <MediaHero
          imageUrl={article.coverImageUrl}
          imageAlt={article.title}
          eyebrow={categoryLabel}
          title={article.title}
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-3">
              {article.authorAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.authorAvatarUrl}
                  alt={authorName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-saffron/25 font-heading text-base text-paper">
                  {authorInitial}
                </span>
              )}
              <div className="leading-tight">
                <p className="text-sm font-medium text-paper">{authorName}</p>
                {authorRole && (
                  <p className="text-[12px] text-paper/60">{authorRole}</p>
                )}
              </div>
            </div>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/65">
              {publishedDate && `${publishedDate} · `}
              {article.readMinutes} {t('minRead')}
            </span>
          </div>
        </MediaHero>

        <article className="mx-auto max-w-[760px] px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
          <Link
            href={Route.Blogs}
            className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-60 hover:text-clay"
          >
            ← {t('allArticles')}
          </Link>

          <p className="mt-8 text-pretty text-[19px] leading-relaxed text-ink/80">
            {article.excerpt}
          </p>

          <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-ink/85">
            {paragraphs.map((block, index) => (
              <p
                key={index}
                className={
                  index === 0
                    ? 'first-letter:float-start first-letter:me-3 first-letter:mt-1 first-letter:font-heading first-letter:text-[3.4rem] first-letter:font-light first-letter:leading-[0.78] first-letter:text-clay'
                    : undefined
                }
              >
                {block}
              </p>
            ))}
          </div>

          {/* Author card */}
          <div className="mt-12 flex items-center gap-4 border-t border-line pt-8">
            {article.authorAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.authorAvatarUrl}
                alt={authorName}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-saffron/15 font-heading text-xl text-clay">
                {authorInitial}
              </span>
            )}
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-60">
                {t('writtenBy')}
              </p>
              <p className="mt-1 font-heading text-lg font-light text-ink">
                {authorName}
              </p>
              {authorRole && (
                <p className="text-[13px] text-ink-60">{authorRole}</p>
              )}
            </div>
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
