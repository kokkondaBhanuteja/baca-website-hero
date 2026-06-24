import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Leaf, ShieldCheck, Landmark } from 'lucide-react'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { CtaLink } from '@/components/ui/cta-link'
import { WordmarkMosaic } from '@/components/ui/wordmark-mosaic'
import { HeroEntry } from '@/components/sections/hero-entry'

// One texture per BACA letter (left→right): sea sourcing, global shipping,
// signature spice, open ocean.
const HERO_WORDMARK_IMAGES = [
  '/images/footer/ocean-2.jpg',
  '/images/global-port.jpg',
  '/images/product-malabar-black-pepper.jpg',
  '/images/footer/ocean-1.jpg',
]

const HERO_FEATURES = [
  {
    icon: Leaf,
    title: 'Indian Origins',
    body: 'Sourced with care from trusted regions',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assured',
    body: 'Rigorous checks at every step',
  },
  {
    icon: Landmark,
    title: 'Global Delivery',
    body: 'Reliable shipments. On time, every time.',
  },
]

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative overflow-hidden bg-paper">
      <HeroEntry>
        <div className="mx-auto flex min-h-[100svh] max-w-[1640px] flex-col px-5 pb-10 pt-header-base sm:px-8 lg:px-12 xl:px-16">
          {/* ── Main: copy + wordmark ── */}
          <div className="grid flex-1 grid-cols-1 items-center gap-x-8 gap-y-12 lg:grid-cols-[minmax(440px,0.46fr)_minmax(0,1fr)]">
            {/* Left: copy */}
            <div className="flex flex-col justify-center">
              {/* Eyebrow */}
              <p
                data-hero-reveal
                className="font-mono text-[0.7rem] uppercase leading-[1.9] tracking-[0.3em] text-forest/80"
              >
                Premium Spices &amp; Agri Produce
                <br />· Trusted Indian Origins
              </p>

              {/* Divider (above headline) */}
              <div
                data-hero-reveal
                className="mb-7 mt-6 h-px w-11 bg-forest/45"
              />

              {/* Headline */}
              <h1
                data-hero-reveal
                className="font-heading text-[2.85rem] font-light leading-[1.02] tracking-[-0.01em] text-forest sm:text-[3.3rem] xl:text-[3.85rem]"
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
                className="mb-9 mt-8 max-w-sm text-[0.98rem] leading-[1.85] text-ink/75"
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

            {/* Right: BACA mosaic wordmark + reflection (desktop) */}
            <div
              data-hero-reveal
              className="hidden lg:flex lg:translate-y-10 lg:items-center lg:justify-center"
            >
              <WordmarkMosaic
                text={SITE.brand}
                images={HERO_WORDMARK_IMAGES}
                align="center"
                reflection
                className="w-full"
              />
            </div>
          </div>

          {/* ── Bottom: full-width feature bar (3 features + tagline) ── */}
          <div
            data-hero-reveal
            className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0"
          >
            {HERO_FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex items-start gap-3.5 lg:border-l lg:border-line lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bone text-forest">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[0.92rem] font-semibold text-ink">
                    {title}
                  </span>
                  <span className="max-w-[15rem] text-[0.8rem] leading-[1.5] text-ink/60">
                    {body}
                  </span>
                </span>
              </div>
            ))}

            {/* Tagline cell */}
            <div className="flex flex-col justify-center gap-3 lg:border-l lg:border-line lg:px-8">
              <p className="font-mono text-[0.78rem] uppercase leading-[1.85] tracking-[0.22em] text-ink/85">
                Built on Trust.
                <br />
                Delivered Globally.
              </p>
              <span className="h-px w-9 bg-forest" aria-hidden />
            </div>
          </div>
        </div>
      </HeroEntry>
    </section>
  )
}
