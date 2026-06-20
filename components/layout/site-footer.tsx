'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CONTACT } from '@/constants/contact'
import { Route } from '@/constants/routes'
import { CERT_MARKS, SITE } from '@/constants/site'
import { FOOTER_COLUMNS } from '@/constants/sections/footer'
import { Link } from '@/i18n/navigation'
import { WordmarkSlideshow } from '@/components/ui/wordmark-slideshow'

gsap.registerPlugin(ScrollTrigger)

const FOOTER_WORDMARK_IMAGES = [
  '/images/footer/ocean-1.jpg',
  '/images/footer/ocean-2.jpg',
  '/images/footer/ocean-3.jpg',
  '/images/footer/ocean-4.jpg',
]

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group/link relative inline-flex w-fit items-center gap-1.5 text-[14px] text-paper/65 transition-colors hover:text-paper"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 start-0 h-px w-0 bg-saffron transition-all duration-300 group-hover/link:w-full" />
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
    </Link>
  )
}

export function SiteFooter() {
  const t = useTranslations('footer')
  const marquee = t.raw('marqueeItems') as string[]
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
    const wordmark = root.querySelector<HTMLElement>('[data-footer-wordmark]')

    if (reduce) return

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

      if (wordmark) {
        // One-shot reveal that fires as soon as the wordmark enters the viewport,
        // so it is fully shown well before the page bottom (a scroll-scrub here
        // can't complete — there is no content below the footer to scroll through).
        gsap.fromTo(
          wordmark,
          { yPercent: 12, autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          {
            yPercent: 0,
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: wordmark, start: 'top 95%' },
          },
        )
      }
    }, root)

    return () => context.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-ink text-paper"
    >
      {/* Tagline marquee */}
      <div className="overflow-hidden border-b border-paper/12 py-6">
        <div className="baca-marquee flex w-max items-center gap-10 whitespace-nowrap font-heading text-[clamp(1.25rem,2.4vw,2rem)] font-light text-paper/85">
          {[...marquee, ...marquee].map((item, index) => (
            <span key={index} className="flex items-center gap-10">
              {item}
              <span
                className="h-1.5 w-1.5 rounded-full bg-saffron"
                aria-hidden
              />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
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

        {/* Columns */}
        <div className="grid gap-x-8 gap-y-12 py-16 lg:grid-cols-12">
          <div data-footer-reveal className="lg:col-span-5">
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-paper/65">
              {t('description')}
            </p>
            <address className="mt-6 not-italic text-[13px] leading-relaxed text-paper/55">
              {SITE.address[0]}
              <br />
              {SITE.address[1]}
              <br />
              <a
                href={CONTACT.phoneHref}
                className="transition-colors hover:text-paper"
              >
                {CONTACT.phoneDisplay}
              </a>
            </address>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav
              key={col.key}
              data-footer-reveal
              className="lg:col-span-2"
              aria-label={t(`columns.${col.key}.title`)}
            >
              <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/40">
                {t(`columns.${col.key}.title`)}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <FooterLink href={link.href}>
                      {t(`columns.${col.key}.links.${link.key}`)}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div data-footer-reveal className="lg:col-span-1">
            <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/40">
              {t('certifiedTitle')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-paper/55">
              {CERT_MARKS.map((mark) => (
                <li key={mark}>{mark}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized ocean wordmark — rises + reveals on scroll, cross-fading stills */}
        <div className="border-t border-paper/12 pt-10">
          <div data-footer-wordmark>
            <WordmarkSlideshow
              text={SITE.brand}
              images={FOOTER_WORDMARK_IMAGES}
              align="left"
              className="w-full"
            />
          </div>
          <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-paper/45">
            {SITE.sub} · Est. {SITE.founded}
          </p>
        </div>

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
            className="group inline-flex items-center gap-2 text-paper/60 transition-colors hover:text-paper"
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
