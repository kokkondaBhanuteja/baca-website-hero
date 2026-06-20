'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CONTACT } from '@/constants/contact'
import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { Link } from '@/i18n/navigation'

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
  // doesn't run elsewhere): footer blocks clip-mask reveal in a stagger, and the
  // oversized wordmark rises + reveals on a scroll-scrub with parallax.
  useEffect(() => {
    const root = footerRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reveals = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-footer-reveal]'),
    )

    if (reduce) return

    // The wordmark itself is intentionally NOT revealed/animated — it shows
    // immediately (the ocean stills cross-fade inside it via WordmarkSlideshow).
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
        {/* Big contact statement */}
        <div
          data-footer-reveal
          className="flex flex-col gap-10 border-b border-paper/12 py-20 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-saffron">
              <span className="h-px w-8 bg-saffron" aria-hidden />
              {t('talkLabel')}
            </p>
            <a
              href={CONTACT.emailHref}
              className="group inline-flex items-start gap-3 font-heading text-[clamp(2.2rem,6.5vw,5rem)] font-light leading-[0.95] tracking-[-0.03em] text-paper"
            >
              {CONTACT.email}
              <ArrowUpRight className="mt-2 h-8 w-8 shrink-0 text-saffron transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
          <Link
            href={Route.Contact}
            data-cursor="fill"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-saffron px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            {t('startEnquiry')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <FooterColumns />
        <FooterWordmark />

        {/* Legal + back to top */}
        <div className="mt-10 flex flex-col gap-4 border-t border-paper/12 py-7 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.brand} · {SITE.sub}
          </p>
          <p className="flex flex-wrap gap-4">
            <span>{SITE.gst}</span>
            <span>{SITE.iec}</span>
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 rounded-full text-paper/60 transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saffron"
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
