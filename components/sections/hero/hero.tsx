import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { CtaLink } from '@/components/ui/cta-link'
import { WordmarkMedia } from '@/components/ui/wordmark-media'
import { HeroEntry } from '@/components/sections/hero-entry'

// Single illustrated India-heritage film shown through the whole wordmark.
const HERO_VIDEO_SOURCES = [{ src: '/videos/hero-v5.mp4', type: 'video/mp4' }]

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-paper">
      <HeroEntry>
        <div className="relative flex w-full flex-col justify-end pb-12 pt-28 sm:pb-16">
          {/* Showpiece: the illustrated India film through the BACA letters */}
          <div data-hero-reveal className="mb-8 w-full px-3 sm:px-6">
            <WordmarkMedia
              text={SITE.brand}
              videoSources={HERO_VIDEO_SOURCES}
              posterSrc="/images/hero-v4-poster.jpg"
              align="center"
              className="w-full"
            />
          </div>

          <div className="mx-auto grid w-full max-w-[1340px] grid-cols-1 items-end gap-10 px-5 sm:px-8 lg:grid-cols-12">
            <div data-hero-reveal className="max-w-md lg:col-span-7">
              <p className="text-pretty text-[15px] leading-relaxed text-ink/75">
                {t('body')}
              </p>
            </div>
            <div
              data-hero-reveal
              className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-self-end"
            >
              <CtaLink href={Route.Products} arrow>
                {t('ctaProducts')}
              </CtaLink>
              <CtaLink href={Route.Contact} variant="outline">
                {t('ctaContact')}
              </CtaLink>
            </div>
          </div>

          <div
            data-hero-reveal
            className="mx-auto mt-12 flex w-full max-w-[1340px] flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/15 px-5 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink/55 sm:px-8"
          >
            <span>{t('countries')}</span>
            <span className="text-ink/30" aria-hidden>
              /
            </span>
            <span>{t('certs')}</span>
          </div>
        </div>
      </HeroEntry>
    </section>
  )
}
