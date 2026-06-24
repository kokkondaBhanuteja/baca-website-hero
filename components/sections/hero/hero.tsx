import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { CtaLink } from '@/components/ui/cta-link'
import { WordmarkMedia } from '@/components/ui/wordmark-media'
import { HeroEntry } from '@/components/sections/hero-entry'

// Looping ocean film revealed through the giant BACA letterforms.
const HERO_VIDEO_SOURCES = [
  { src: '/videos/hero-ocean.mp4', type: 'video/mp4' },
]

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative bg-white">
      <HeroEntry>
        <div className="grid min-h-[100svh] grid-cols-1 pt-header-base lg:grid-cols-2">
          {/* ── Left: hero content ── */}
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:px-12 xl:px-16">
            {/* Eyebrow */}
            <p
              data-hero-reveal
              className="mb-8 font-mono text-[0.72rem] uppercase tracking-[0.35em] text-ink/70"
            >
              Premium Spices &amp; Agri Produce &nbsp;·&nbsp; Trusted Indian
              Origins
            </p>

            {/* Headline */}
            <h1
              data-hero-reveal
              className="font-heading text-[3rem] font-light leading-[1.06] tracking-[0.01em] text-ink sm:text-[3.8rem] lg:text-[4.2rem] xl:text-[5rem]"
            >
              {t.rich('headline', {
                em: (chunks: ReactNode) => (
                  <em className="not-italic text-ink/50">{chunks}</em>
                ),
                br: () => <br />,
              })}
            </h1>

            {/* Divider */}
            <div data-hero-reveal className="my-8 h-px w-16 bg-saffron" />

            {/* Body */}
            <p
              data-hero-reveal
              className="mb-10 max-w-lg text-[1rem] leading-[1.9] text-ink/80 sm:text-[1.05rem]"
            >
              {t('body')}
            </p>

            {/* CTAs */}
            <div data-hero-reveal className="flex flex-wrap gap-3">
              <CtaLink
                href={Route.Products}
                variant="solid"
                tone="light"
                size="lg"
                arrow
              >
                {t('ctaProducts')}
              </CtaLink>
              <CtaLink
                href={Route.Contact}
                variant="outline"
                tone="light"
                size="lg"
                arrow
              >
                {t('ctaContact')}
              </CtaLink>
            </div>
          </div>

          {/* ── Right: BACA wordmark with ocean film through the letters ── */}
          <div
            data-hero-reveal
            className="relative hidden items-center lg:flex lg:px-10 lg:pl-3 xl:px-14 xl:pl-4"
          >
            <WordmarkMedia
              text={SITE.brand}
              videoSources={HERO_VIDEO_SOURCES}
              posterSrc="/images/footer/ocean-1.jpg"
              align="center"
              className="w-full"
            />
          </div>
        </div>
      </HeroEntry>
    </section>
  )
}
