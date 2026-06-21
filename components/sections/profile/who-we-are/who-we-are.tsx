import { getTranslations } from 'next-intl/server'

import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

/**
 * Profile page — "Who we are" section. Editorial body block introducing
 * BACA. Pure text + reveal animation; no image (the page already opens
 * with a PageIntro above this).
 */
export async function WhoWeAre() {
  const t = await getTranslations('profilePage.whoWeAre')

  return (
    <section id="who-we-are" className="scroll-mt-header-offset bg-paper">
      <div className="mx-auto max-w-content px-5 py-[clamp(4rem,8vw,7rem)] sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
            </Reveal>
            <Reveal>
              <h2 className="max-w-[16ch] text-balance font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
                {t('heading')}
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="max-w-[64ch] text-[16px] leading-relaxed text-ink/80">
                {t('body')}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
