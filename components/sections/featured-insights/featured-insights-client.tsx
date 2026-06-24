'use client'

import { useRef } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'

import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import type { BlogArticleSummaryDto } from '@/lib/shared/types/blog-dto'

interface Props {
  articles: BlogArticleSummaryDto[]
  eyebrow: string
  heading: string
  allArticlesLabel: string
  minReadLabel: string
  featuredLabel: string
}

const CARD_COLORS = [
  'from-[#1A0B07]',
  'from-[#0F1A0A]',
  'from-[#0A0F1A]',
  'from-[#1A0F07]',
  'from-[#0F0A1A]',
]

export function FeaturedInsightsClient({
  articles,
  eyebrow,
  heading,
  allArticlesLabel,
  minReadLabel,
  featuredLabel,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector('[data-card]') as HTMLElement | null
    const gap = 20
    const amount = (card?.offsetWidth ?? 340) + gap
    el.scrollBy({
      left: dir === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 font-mono text-[0.75rem] uppercase tracking-[0.35em] text-[#2E0F13]/60">
              {eyebrow}
            </p>
            <h2 className="font-heading text-[2.4rem] font-light leading-[1.06] text-[#2E0F13] sm:text-[3rem]">
              {heading}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2E0F13]/20 text-[#2E0F13]/50 transition-all hover:border-[#8B3A1A] hover:bg-[#8B3A1A] hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2E0F13]/20 text-[#2E0F13]/50 transition-all hover:border-[#8B3A1A] hover:bg-[#8B3A1A] hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
            <Link
              href={Route.Blogs}
              className="group ml-2 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#2E0F13]/55 transition-colors hover:text-[#8B3A1A]"
            >
              {allArticlesLabel}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll rail */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-5 pb-6 [scroll-snap-type:x_mandatory] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article, idx) => (
          <Link
            key={`${article.slug}-${idx}`}
            href={`${Route.Blogs}/${article.slug}`}
            data-card
            className="group relative flex min-w-[78vw] flex-shrink-0 flex-col overflow-hidden rounded-2xl sm:min-w-[46vw] lg:min-w-[30vw] [scroll-snap-align:start]"
          >
            {/* Image */}
            {article.coverImageUrl ? (
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${CARD_COLORS[idx % CARD_COLORS.length]} to-[#2E0F13]/60`}
              />
            )}

            {/* Gradient overlay — always present for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B07]/95 via-[#1A0B07]/30 to-transparent" />

            {/* Card content — fixed height so cards align */}
            <div className="relative flex h-[420px] flex-col justify-between p-7 sm:h-[460px]">
              {/* Top: category + read time */}
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                  {article.featured ? featuredLabel : article.blogType.name}
                </span>
                <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-white/45">
                  {article.readMinutes} {minReadLabel}
                </span>
              </div>

              {/* Bottom: title + arrow */}
              <div>
                {/* Article number */}
                <p className="mb-3 font-mono text-[0.55rem] uppercase tracking-[0.28em] text-white/30">
                  {String(idx + 1).padStart(2, '0')}
                </p>

                <h3 className="font-heading mb-5 text-[1.55rem] font-light leading-[1.2] text-white transition-colors duration-300 group-hover:text-[#E8A870] sm:text-[1.75rem]">
                  {article.title}
                </h3>

                <div className="flex items-center justify-between border-t border-white/12 pt-4">
                  <p className="max-w-[80%] text-[0.78rem] leading-[1.7] text-white/50 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/50 transition-all duration-300 group-hover:border-[#E8A870] group-hover:bg-[#E8A870]/10 group-hover:text-[#E8A870]">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
