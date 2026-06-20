import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { Link } from '@/i18n/navigation'
import { Eyebrow } from '@/components/ui/eyebrow'
import { WordmarkLetters } from '@/components/ui/wordmark-letters'
import { HeroEntry } from '@/components/sections/hero-entry'

// Incredible-India montage shown through the letters: palace + festivals + culture.
const HERO_WORDMARK_IMAGES = [
  '/images/hero-india/india-1.jpg', // Hawa Mahal
  '/images/hero-india/india-2.jpg', // Holi
  '/images/hero-india/india-3.jpg', // Rangoli + diyas
  '/images/hero-india/india-4.jpg', // Marigold + diyas
]

export async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-paper">
      <HeroEntry>
        <div className="relative flex w-full flex-col justify-end pb-12 pt-28 sm:pb-16">
          <div
            data-hero-reveal
            className="mx-auto mb-6 w-full max-w-[1340px] px-5 sm:px-8"
          >
            <Eyebrow className="text-ink/70">{t('eyebrow')}</Eyebrow>
          </div>

          {/* Showpiece: each BACA letter is its own India image-window */}
          <div className="mb-8 w-full px-3 sm:px-6">
            <WordmarkLetters
              text={SITE.brand}
              images={HERO_WORDMARK_IMAGES}
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
                className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {t('ctaContact')}
              </Link>
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
