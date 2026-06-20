'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SITE } from '@/constants/site'

import { FooterColumns } from '@/components/layout/site-footer/footer-columns'
import { FooterMarquee } from '@/components/layout/site-footer/footer-marquee'
import { FooterWordmark } from '@/components/layout/site-footer/footer-wordmark'

gsap.registerPlugin(ScrollTrigger)

export function SiteFooter() {
  const t = useTranslations('footer')
  const marqueeItems = t.raw('marqueeItems') as string[]
  const year = new Date().getFullYear()
  const footerRef = useRef<HTMLElement | null>(null)

  // Self-contained scroll motion (works on every page; the home ScrollFX driver
  // doesn't run elsewhere): footer blocks clip-mask reveal in a stagger. The
  // wordmark itself is intentionally NOT animated — it shows immediately
  // (ocean stills cross-fade inside it via WordmarkSlideshow).
  useEffect(() => {
    const root = footerRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const reveals = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-footer-reveal]'),
    )
    const context = gsap.context(() => {
      reveals.forEach((element) => {
        gsap.from(element, {
          yPercent: 16,
          autoAlpha: 0,
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%' },
        })
      })
    }, root)

    return () => context.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-ink text-paper"
    >
      <FooterMarquee items={marqueeItems} />

      <div className="mx-auto max-w-content px-5 sm:px-8">
        <FooterColumns />
        <FooterWordmark />

        {/* Legal + back to top — single tight row */}
        <div className="mt-6 flex flex-col gap-3 border-t border-paper/12 py-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              © {year} {SITE.brand}
            </span>
            <span>{SITE.gst}</span>
            <span>{SITE.iec}</span>
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 self-start rounded-full text-paper/60 transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saffron sm:self-auto"
          >
            {t('backToTop')}
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-paper/25 transition-colors group-hover:border-saffron">
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
