'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import type { BlogArticleSummaryDto } from '@/lib/shared/types/blog-dto'
import type { BlogTypePublicDto } from '@/lib/shared/types/blog-type-dto'
import { formatPublishedDate } from '@/lib/shared/format-date'
import { MediaReveal } from '@/components/ui/media-reveal'
import { cn } from '@/lib/utils'

const ALL = '__all__'

interface BlogsFilterLabels {
  all: string
  filterBy: string
  minRead: string
  featured: string
  empty: string
  published: string
  readTime: string
}

export function BlogsFilter({
  articles,
  types,
  locale,
  labels,
}: {
  articles: BlogArticleSummaryDto[]
  types: BlogTypePublicDto[]
  locale: Locale
  labels: BlogsFilterLabels
}) {
  // The page defaults to the "All" tab (every article). The header's "Blogs"
  // dropdown links here as `/blogs?type=<slug>`; read that param as the initial
  // selection (falling back to ALL when absent/unknown), and sync it on later
  // navigations. Pill clicks update state instantly without touching the URL.
  const searchParams = useSearchParams()
  const requestedType = searchParams.get('type')
  const resolvedType =
    requestedType && types.some((type) => type.slug === requestedType)
      ? requestedType
      : ALL

  const [selected, setSelected] = useState<string>(resolvedType)
  const [lastRequested, setLastRequested] = useState<string>(resolvedType)
  if (resolvedType !== lastRequested) {
    setLastRequested(resolvedType)
    setSelected(resolvedType)
  }

  const visible =
    selected === ALL
      ? articles
      : articles.filter((article) => article.blogType.slug === selected)

  const pills = [{ slug: ALL, name: labels.all }, ...types]

  return (
    <div className="mt-12">
      <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-60">
        {labels.filterBy}
      </p>
      <div
        role="tablist"
        aria-label={labels.filterBy}
        className="flex flex-wrap gap-2.5"
      >
        {pills.map((pill) => {
          const isActive = pill.slug === selected
          return (
            <button
              key={pill.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelected(pill.slug)}
              className={cn(
                'rounded-full border px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors',
                isActive
                  ? 'border-saffron bg-saffron/15 text-ink'
                  : 'border-line text-ink-60 hover:border-ink/40 hover:text-ink',
              )}
            >
              {pill.name}
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-ink-60">{labels.empty}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => {
            const published = formatPublishedDate(article.publishedAt, locale)
            const badge = article.featured
              ? labels.featured
              : article.blogType.name
            return (
              <Link
                key={article.slug}
                href={`${Route.Blogs}/${article.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-cream transition-colors hover:border-ink/30"
              >
                <MediaReveal className="relative aspect-[4/3] bg-bone">
                  {article.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-bone" />
                  )}
                  <span className="absolute start-3 top-3 inline-block rounded-full bg-ink/85 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper backdrop-blur-sm">
                    {badge}
                  </span>
                </MediaReveal>

                <div className="px-5 pb-5 pt-4">
                  <h2 className="font-heading text-xl font-medium leading-snug text-ink transition-colors group-hover:text-clay">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-1 line-clamp-3 font-heading text-[14px] italic leading-snug text-clay">
                      {article.excerpt}
                    </p>
                  )}
                  <dl className="mt-5 space-y-2 border-t border-line pt-4">
                    {published && (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[13px] text-ink/60">
                          {labels.published}
                        </dt>
                        <dd className="text-end text-[13px] font-medium text-ink">
                          {published}
                        </dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-[13px] text-ink/60">
                        {labels.readTime}
                      </dt>
                      <dd className="text-end text-[13px] font-medium text-ink">
                        {article.readMinutes} {labels.minRead}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
