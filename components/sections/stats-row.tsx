'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { STATS, type StatConfig } from '@/constants/sections/stats'

function format(n: number) {
  return n.toLocaleString('en-US')
}

function CountUp({ stat, label }: { stat: StatConfig; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        if (reduce) {
          setDisplay(stat.value)
          return
        }

        const duration = 1600
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setDisplay(Math.round(stat.value * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [stat.value])

  return (
    <div ref={ref} className="border-t border-line pt-5">
      <div className="font-heading text-[clamp(2.75rem,5vw,4.5rem)] font-light leading-none tracking-[-0.03em] text-ink">
        {stat.prefix}
        {format(display)}
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

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[1340px] grid-cols-1 gap-x-10 gap-y-10 px-5 pb-[clamp(4rem,8vw,8rem)] sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <CountUp
            key={stat.key}
            stat={stat}
            label={t(`items.${stat.key}` as Parameters<typeof t>[0])}
          />
        ))}
      </div>
    </section>
  )
}
