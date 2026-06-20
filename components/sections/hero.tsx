import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { Link } from '@/i18n/navigation'
import { Eyebrow } from '@/components/ui/eyebrow'
import { WordmarkMedia } from '@/components/ui/wordmark-media'
import { HeroEntry } from '@/components/sections/hero-entry'

const WORDMARK_VIDEO_SOURCES = [
  { src: '/videos/spice-heritage.mp4', type: 'video/mp4' },
]

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink to-[#1a120a]" />

      <HeroEntry>
        <div className="relative mx-auto flex w-full max-w-[1340px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <div data-hero-reveal className="mb-6">
            <Eyebrow className="text-paper/80">{t('eyebrow')}</Eyebrow>
          </div>

          {/* Showpiece: BACA rendered in spice */}
          <div data-hero-reveal className="mb-8">
            <WordmarkMedia
              text={SITE.brand}
              videoSources={WORDMARK_VIDEO_SOURCES}
              posterSrc="/images/wordmark-poster.jpg"
              className="w-full"
            />
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div
              data-hero-reveal
              className="col-span-12 max-w-md lg:col-span-7"
            >
              <p className="text-pretty text-[15px] leading-relaxed text-paper/85">
                {t('body')}
              </p>
            </div>
            <div
              data-hero-reveal
              className="col-span-12 flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-self-end"
            >
              <Link
                href={Route.Products}
                data-cursor="fill"
                className="group inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-clay hover:text-paper"
              >
                {t('ctaProducts')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href={Route.Contact}
                data-cursor="fill"
                className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                {t('ctaContact')}
              </Link>
            </div>
          </div>

          <div
            data-hero-reveal
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper/15 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper/65"
          >
            <span>{t('countries')}</span>
            <span className="text-paper/30" aria-hidden>
              /
            </span>
            <span>{t('certs')}</span>
          </div>
        </div>
      </HeroEntry>
    </section>
  )
}
