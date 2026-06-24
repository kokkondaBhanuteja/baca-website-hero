import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { CtaLink } from '@/components/ui/cta-link'
import { WordmarkMedia } from '@/components/ui/wordmark-media'
import { HeroEntry } from '@/components/sections/hero-entry'

// Single looping film revealed through the BACA letterforms.
const HERO_VIDEO_SOURCES = [{ src: '/videos/footer-v1.mp4', type: 'video/mp4' }]

const HERO_FEATURES = [
  {
    title: 'Indian Origins',
    body: 'Sourced with care from trusted regions',
  },
  {
    title: 'Quality Assured',
    body: 'Rigorous checks at every step',
  },
  {
    title: 'Global Delivery',
    body: 'Reliable shipments, on time, every time',
  },
]

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-paper">
      <HeroEntry>
        <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 sm:px-8 lg:px-12 xl:px-16">
          {/* ── Main: copy + wordmark ── */}
          <div className="grid flex-1 grid-cols-1 content-center items-center gap-x-12 gap-y-10 pt-header-base lg:grid-cols-[minmax(440px,0.85fr)_minmax(0,1fr)]">
            {/* Left: copy */}
            <div className="flex min-w-0 max-w-xl flex-col justify-center">
              {/* Eyebrow */}
              <p
                data-hero-reveal
                className="font-mono text-[0.7rem] uppercase leading-[1.9] tracking-[0.3em] text-forest/80"
              >
                Premium Spices &amp; Agri Produce
                <br />· Trusted Indian Origins
              </p>

              {/* Divider */}
              <div
                data-hero-reveal
                className="mb-8 mt-7 h-px w-12 bg-forest/40"
              />

              {/* Headline */}
              <h1
                data-hero-reveal
                className="font-heading text-[2.9rem] font-light leading-[1.0] tracking-[-0.01em] text-forest sm:text-[3.4rem] xl:text-[4rem]"
              >
                {t.rich('headline', {
                  em: (chunks: ReactNode) => (
                    <em className="not-italic text-forest/40">{chunks}</em>
                  ),
                  br: () => <br />,
                })}
              </h1>

              {/* Body */}
              <p
                data-hero-reveal
                className="mb-10 mt-8 max-w-md text-[1rem] leading-[1.85] text-ink/75"
              >
                {t('body')}
              </p>

              {/* CTAs */}
              <div
                data-hero-reveal
                className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center"
              >
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

            {/* Right: BACA wordmark — single film through the letters. Visible at
                every breakpoint: full-width centred when stacked (mobile/tablet),
                the larger right column on lg+. */}
            <div
              data-hero-reveal
              className="flex min-w-0 items-center justify-center"
            >
              <WordmarkMedia
                text={SITE.brand}
                videoSources={HERO_VIDEO_SOURCES}
                posterSrc="/images/footer/ocean-1.jpg"
                align="center"
                reflection
                className="mx-auto w-full max-w-[380px] sm:max-w-[520px] lg:mx-0 lg:max-w-[700px] lg:translate-y-4"
              />
            </div>
          </div>

          {/* ── Bottom: full-width feature band (3 features + tagline) ── */}
          <div
            data-hero-reveal
            className="mt-10 grid grid-cols-1 gap-y-8 border-t border-line pb-10 pt-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0"
          >
            {HERO_FEATURES.map(({ title, body }) => (
              <div
                key={title}
                className="lg:border-l lg:border-line lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <span
                  className="mb-4 block h-px w-7 bg-forest/40"
                  aria-hidden
                />
                <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-ink">
                  {title}
                </h3>
                <p className="mt-2 max-w-[15rem] text-[0.82rem] leading-relaxed text-ink/55">
                  {body}
                </p>
              </div>
            ))}

            {/* Tagline cell — closing brand statement */}
            <div className="lg:border-l lg:border-line lg:px-8">
              <span className="mb-4 block h-px w-7 bg-forest" aria-hidden />
              <p className="font-mono text-[0.74rem] uppercase leading-[1.9] tracking-[0.2em] text-ink/70">
                Built on Trust.
                <br />
                Delivered Globally.
              </p>
            </div>
          </div>
        </div>
      </HeroEntry>
    </section>
  )
}
