import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { CtaLink } from '@/components/ui/cta-link'
import { Eyebrow } from '@/components/ui/eyebrow'
import { WordmarkSlideshow } from '@/components/ui/wordmark-slideshow'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

// Reuses the same ocean stills the footer wordmark cycles through — keeps the
// 404 visually consistent with the rest of the brand and reinforces the
// "this consignment never shipped / lost at sea" tone.
const NOT_FOUND_IMAGES = [
  '/images/footer/ocean-1.jpg',
  '/images/footer/ocean-2.jpg',
  '/images/footer/ocean-3.jpg',
  '/images/footer/ocean-4.jpg',
]

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <>
      <SiteHeader forceSolid />
      <main className="relative flex min-h-[100svh] flex-col overflow-hidden bg-paper pt-header-base">
        <section className="mx-auto flex w-full max-w-content flex-1 flex-col items-center justify-center px-5 py-[clamp(2.5rem,6vw,4.5rem)] text-center sm:px-8">
          <Eyebrow className="mb-6 justify-center text-ink/60">
            {t('eyebrow')}
          </Eyebrow>

          <div className="w-full">
            <WordmarkSlideshow
              text="404"
              images={NOT_FOUND_IMAGES}
              align="center"
              className="w-full"
            />
          </div>

          <div className="mt-8 flex max-w-2xl flex-col items-center">
            <h1 className="text-balance font-heading text-[clamp(1.9rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
              {t('heading')}
            </h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-60">
              {t('body')}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <CtaLink href={Route.Home} arrow>
                {t('ctaHome')}
              </CtaLink>
              <CtaLink href={Route.Products} variant="outline">
                {t('ctaProducts')}
              </CtaLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
