'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

import { PILLARS } from '@/constants/sections/approach'
import { Eyebrow } from '@/components/ui/eyebrow'

gsap.registerPlugin(ScrollTrigger)

export function Approach() {
  const ref = useRef<HTMLElement | null>(null)
  const t = useTranslations('approach')

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.approach-card', { opacity: 1, y: 0 })
        gsap.set('.approach-rule', { scaleX: 1 })
        return
      }
      gsap.set('.approach-card', { opacity: 0, y: 40 })
      gsap.set('.approach-rule', { scaleX: 0 })
      ScrollTrigger.create({
        trigger: root,
        start: 'top 72%',
        once: true,
        onEnter: () => {
          gsap.to('.approach-card', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
          })
          gsap.to('.approach-rule', {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.12,
          })
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section id="approach" ref={ref} className="scroll-mt-[88px] bg-paper">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
            <h2
              data-reveal
              className="text-balance font-heading text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink"
            >
              {t('heading')}
            </h2>
            <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-ink-60">
              {t('intro')}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <div
                  key={p.key}
                  className="approach-card group relative border-t border-line pt-7"
                >
                  <span
                    className="approach-rule absolute -top-px start-0 h-[2px] w-full origin-left bg-saffron rtl:origin-right"
                    aria-hidden
                  />
                  <div className="flex items-baseline gap-4">
                    <span className="font-heading text-[2rem] font-light italic leading-none text-saffron">
                      {p.n}
                    </span>
                    <h3 className="font-heading text-2xl font-light text-ink transition-colors group-hover:text-clay">
                      {t(`pillars.${p.key}.title` as Parameters<typeof t>[0])}
                    </h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-60">
                    {t(`pillars.${p.key}.body` as Parameters<typeof t>[0])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
