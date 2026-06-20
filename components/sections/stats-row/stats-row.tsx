'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import {
  INTERSECTION_THRESHOLD,
  STATS_COUNTUP_DURATION_MS,
} from '@/constants/animations'
import { STATS, type StatConfig } from '@/constants/sections/stats'

function format(n: number, locale: string) {
  // Locale-aware grouping (Indian/Arabic/European separators differ).
  return n.toLocaleString(locale)
}

function CountUp({
  stat,
  label,
  locale,
}: {
  stat: StatConfig
  label: string
  locale: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let rafId = 0
    let cancelled = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        if (reduce) {
          setDisplay(stat.value)
          return
        }

        const start = performance.now()
        const tick = (now: number) => {
          if (cancelled) return
          const progress = Math.min(
            (now - start) / STATS_COUNTUP_DURATION_MS,
            1,
          )
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(stat.value * eased))
          if (progress < 1) rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
      },
      { threshold: INTERSECTION_THRESHOLD.REVEAL },
    )

    observer.observe(node)
    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [stat.value])

  return (
    <div ref={ref} className="border-t border-line pt-5">
      <div className="font-heading text-[clamp(2.75rem,5vw,4.5rem)] font-light leading-none tracking-[-0.03em] text-ink">
        {stat.prefix}
        {format(display, locale)}
        <span className="text-saffron">{stat.suffix}</span>
      </div>
      <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-60">
        {label}
      </p>
    </div>
  )
}

export function StatsRow() {
  const t = useTranslations('stats')
  const locale = useLocale()

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-content grid-cols-1 gap-x-10 gap-y-10 px-5 pb-[clamp(4rem,8vw,8rem)] sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <CountUp
            key={stat.key}
            stat={stat}
            label={t(`items.${stat.key}` as Parameters<typeof t>[0])}
            locale={locale}
          />
        ))}
      </div>
    </section>
  )
}
