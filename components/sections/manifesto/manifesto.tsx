import { getTranslations } from 'next-intl/server'

import { REVEAL_STAGGER_MS } from '@/constants/animations'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'
import { RevealImage } from '@/components/ui/reveal-image'
import { richTags } from '@/components/ui/rich'

export async function Manifesto() {
  const t = await getTranslations('manifesto')

  return (
    <section id="why-we-re-here" className="scroll-mt-header-offset bg-paper">
      <div className="mx-auto grid max-w-content items-center gap-12 px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow className="mb-8 text-ink-60">{t('eyebrow')}</Eyebrow>
          </Reveal>
          <Reveal delay={REVEAL_STAGGER_MS.MANIFESTO_PRIMARY}>
            <p className="max-w-[22ch] text-balance font-heading text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.12] tracking-[-0.02em] text-ink">
              {t.rich('headline', richTags)}
            </p>
          </Reveal>
          <Reveal delay={REVEAL_STAGGER_MS.MANIFESTO_SECONDARY}>
            <p className="mt-8 max-w-[46ch] text-[15px] leading-relaxed text-ink-60">
              {t('body')}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <RevealImage
            src="/images/who-we-are.jpg"
            alt={t('imageAlt')}
            className="aspect-[4/5] w-full rounded-2xl border border-line"
          />
        </div>
      </div>
    </section>
  )
}
