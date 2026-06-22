import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { CtaLink } from '@/components/ui/cta-link'
import { HeroEntry } from '@/components/sections/hero-entry'

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="@container relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-mist py-28">
      <HeroEntry>
        {/* GMCT-style showpiece: one oversized headline that breaks out of the
            content column to fill the FULL viewport width. Sized in `cqw`
            (container-width units, the section is the @container) so the single
            line scales with the whole screen — `9.6cqw` ≈ the width of this
            25-char tagline at the tightened tracking, flush edge-to-edge without
            overflowing (whitespace-nowrap + the section's overflow-hidden). */}
        <h1
          data-hero-reveal
          className="whitespace-nowrap px-2 font-heading text-[10cqw] font-light leading-[1.0] tracking-[-0.05em] text-pine sm:px-3"
        >
          {t.rich('headline', {
            em: (chunks: ReactNode) => (
              <span className="text-saffron">{chunks}</span>
            ),
          })}
        </h1>

        {/* Supporting content stays in the centered max-w-content column */}
        <div className="mx-auto mt-10 grid w-full max-w-content grid-cols-1 items-end gap-10 px-5 sm:px-8 lg:grid-cols-12">
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

        {/* GMCT-style bottom labels/stats strip */}
        <div
          data-hero-reveal
          className="mx-auto mt-12 flex w-full max-w-content flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/15 px-5 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink/55 sm:px-8"
        >
          <span>{t('countries')}</span>
          <span className="text-ink/30" aria-hidden>
            /
          </span>
          <span>{t('certs')}</span>
        </div>
      </HeroEntry>
    </section>
  )
}
