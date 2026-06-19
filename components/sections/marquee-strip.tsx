'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'

/**
 * GSAP banner marquee: a seamless horizontal loop whose speed and skew react to
 * scroll velocity (faster + leaning while you scroll, easing back to a calm drift
 * when idle). Reduced motion → static.
 */
export function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const t = useTranslations('marqueeStrip')
  const items = t.raw('items') as string[]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const loop = gsap.to(track, { xPercent: -50, repeat: -1, duration: 24, ease: 'none' })
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' })

    let lastY = window.scrollY
    let lastT = performance.now()
    let idle: ReturnType<typeof setTimeout>

    const onScroll = () => {
      const y = window.scrollY
      const t = performance.now()
      const v = (y - lastY) / Math.max(1, t - lastT) // px per ms
      lastY = y
      lastT = t
      gsap.to(loop, {
        timeScale: 1 + gsap.utils.clamp(0, 5, Math.abs(v) * 4),
        duration: 0.3,
        overwrite: true,
      })
      skewTo(gsap.utils.clamp(-8, 8, v * -7))
      clearTimeout(idle)
      idle = setTimeout(() => {
        gsap.to(loop, { timeScale: 1, duration: 0.8 })
        skewTo(0)
      }, 140)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idle)
      loop.kill()
    }
  }, [])

  return (
    <section
      aria-label={t('ariaLabel')}
      className="overflow-hidden border-y border-line bg-cream py-4"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((dup) => (
          <ul key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {items.map((item) => (
              <li
                key={`${dup}-${item}`}
                className="flex items-center gap-6 px-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/65"
              >
                {item}
                <span className="text-saffron" aria-hidden>
                  •
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
