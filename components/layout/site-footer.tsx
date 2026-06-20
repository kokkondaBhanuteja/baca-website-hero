'use client'

import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CONTACT } from '@/constants/contact'
import { Route } from '@/constants/routes'
import { CERT_MARKS, SITE } from '@/constants/site'
import { FOOTER_COLUMNS } from '@/constants/sections/footer'
import { Link } from '@/i18n/navigation'
import { WordmarkMedia } from '@/components/ui/wordmark-media'

const FOOTER_WORDMARK_VIDEO_SOURCES = [
  { src: '/videos/spice-heritage.mp4', type: 'video/mp4' },
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
      className="relative inline-block w-fit text-[14px] text-paper/70 transition-colors hover:text-paper after:absolute after:-bottom-0.5 after:start-0 after:h-px after:w-0 after:bg-saffron after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  )
}

export function SiteFooter() {
  const t = useTranslations('footer')
  const marquee = t.raw('marqueeItems') as string[]
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      {/* Tagline marquee */}
      <div className="overflow-hidden border-b border-paper/12 py-6">
        <div className="baca-marquee flex w-max items-center gap-10 whitespace-nowrap font-heading text-[clamp(1.25rem,2.4vw,2rem)] font-light text-paper/85">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m}
              <span
                className="h-1.5 w-1.5 rounded-full bg-saffron"
                aria-hidden
              />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        {/* Big contact line */}
        <div className="flex flex-col gap-8 border-b border-paper/12 py-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-saffron">
              {t('talkLabel')}
            </p>
            <a
              href={CONTACT.emailHref}
              className="group inline-flex items-end gap-3 font-heading text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-paper"
            >
              {CONTACT.email}
              <ArrowUpRight className="mb-1 h-7 w-7 text-saffron transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
          <Link
            href={Route.Contact}
            data-cursor="fill"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            {t('startEnquiry')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Columns */}
        <div className="grid gap-x-8 gap-y-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
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

          <div className="lg:col-span-1">
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

        {/* Oversized wordmark — video showing through the letters */}
        <div data-reveal className="border-t border-paper/12 pt-8">
          <WordmarkMedia
            text={SITE.brand}
            videoSources={FOOTER_WORDMARK_VIDEO_SOURCES}
            posterSrc="/images/wordmark-poster.jpg"
            className="w-full"
          />
          <p className="mt-2 text-end font-mono text-[0.62rem] uppercase tracking-[0.22em] text-paper/45">
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
