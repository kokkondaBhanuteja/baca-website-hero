import type { Metadata } from 'next'
import { ChevronLeft } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import {
  getPublishedArticleBySlug,
  listRelatedArticles,
} from '@/lib/server/services/blog-article-service'
import { listPublishedBlogTypes } from '@/lib/server/services/blog-type-service'
import { formatPublishedDate } from '@/lib/shared/format-date'
import { MediaReveal } from '@/components/ui/media-reveal'
import { MarkdownContent } from '@/components/shared/markdown-content'
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

  const [related, allBlogTypes] = await Promise.all([
    listRelatedArticles(articleSlug, locale as Locale),
    listPublishedBlogTypes(locale as Locale),
  ])

  const authorName = article.authorName ?? DEFAULT_AUTHOR.name
  const authorRole = article.authorRole ?? DEFAULT_AUTHOR.role
  const authorInitial = authorName.charAt(0).toUpperCase()
  const publishedDate = formatPublishedDate(
    article.publishedAt,
    locale as Locale,
  )

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
                href={Route.Blogs}
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-forest transition-colors hover:text-clay"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('allArticles')}
              </Link>

              <h1 className="mt-7 font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.04] tracking-[-0.02em] text-ink">
                {article.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[14px] text-ink-60">
                {publishedDate && (
                  <>
                    <span>{publishedDate}</span>
                    <span className="text-ink/30" aria-hidden>
                      |
                    </span>
                  </>
                )}
                <span className="text-forest">{article.blogType.name}</span>
              </div>

              {article.coverImageUrl && (
                <MediaReveal className="mt-9 rounded-2xl border border-line bg-bone">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="aspect-[16/10] w-full object-cover"
                  />
                </MediaReveal>
              )}

              <p className="mt-9 text-pretty text-[18px] leading-relaxed text-ink/80">
                {article.excerpt}
              </p>

              <MarkdownContent content={article.body} className="mt-8" />

              {/* Author card — bottom of article */}
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
                  <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-60">
                    {article.readMinutes} {t('minRead')}
                  </p>
                </div>
              </div>
            </article>

            {/* SIDEBAR ------------------------------------------------------- */}
            <aside className="min-w-0 lg:pt-1">
              {allBlogTypes.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl font-medium text-ink">
                    {t('categoriesHeading')}
                  </h2>
                  <ul className="mt-5 flex flex-col gap-3.5">
                    <li>
                      <Link
                        href={Route.Blogs}
                        className="text-[15px] leading-snug text-ink/80 transition-colors hover:text-clay"
                      >
                        {t('allArticles')}
                      </Link>
                    </li>
                    {allBlogTypes.map((type) => (
                      <li key={type.slug}>
                        <Link
                          href={Route.Blogs}
                          className={cn(
                            'text-[15px] leading-snug transition-colors hover:text-clay',
                            type.slug === article.blogType.slug
                              ? 'font-medium text-forest'
                              : 'text-ink/80',
                          )}
                        >
                          {type.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {related.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-heading text-2xl font-medium text-ink">
                    {t('related')}
                  </h2>
                  <ul className="mt-5 flex flex-col gap-5">
                    {related.slice(0, 3).map((item) => {
                      const itemDate = formatPublishedDate(
                        item.publishedAt,
                        locale as Locale,
                      )
                      return (
                        <li key={item.slug}>
                          <Link
                            href={`${Route.Blogs}/${item.slug}`}
                            className="group flex items-start gap-3.5"
                          >
                            {item.coverImageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.coverImageUrl}
                                alt=""
                                className="h-20 w-20 shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-20 w-20 shrink-0 rounded-md bg-bone" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-[14px] font-medium leading-snug text-ink transition-colors group-hover:text-clay">
                                {item.title}
                              </p>
                              {itemDate && (
                                <p className="mt-1 text-[12px] text-ink-60">
                                  {itemDate}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
