'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import type { BlogArticleSummaryDto } from '@/lib/shared/types/blog-dto'
import type { BlogTypePublicDto } from '@/lib/shared/types/blog-type-dto'
import { MediaReveal } from '@/components/ui/media-reveal'
import { cn } from '@/lib/utils'

const ALL = '__all__'

interface BlogsFilterLabels {
  all: string
  filterBy: string
  minRead: string
  featured: string
  empty: string
}

export function BlogsFilter({
  articles,
  types,
  labels,
}: {
  articles: BlogArticleSummaryDto[]
  types: BlogTypePublicDto[]
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
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
          {visible.map((article) => (
            <Link
              key={article.slug}
              href={`${Route.Blogs}/${article.slug}`}
              className="group block"
            >
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
                  {article.featured ? labels.featured : article.blogType.name}
                </span>
                <span>
                  {article.readMinutes} {labels.minRead}
                </span>
              </div>
              <h2 className="mt-4 max-w-[28ch] text-balance font-heading text-xl font-light leading-snug text-ink transition-colors group-hover:text-clay">
                {article.title}
              </h2>
              <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-ink-60">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
