import { getTranslations } from 'next-intl/server'

import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

const STEPS = [
  { key: 'source', n: '01' },
  { key: 'grade', n: '02' },
  { key: 'document', n: '03' },
  { key: 'ship', n: '04' },
] as const

/**
 * Profile page — "How we work" four-step process. Numbered cards mirror the
 * home page Approach pillars (same display-numeral pattern), but rendered as
 * a server component (no GSAP — Reveal handles the entrance).
 */
export async function HowWeWork() {
  const t = await getTranslations('profilePage.howWeWork')

  return (
    <section id="how-we-work" className="scroll-mt-header-offset bg-paper">
      <div className="mx-auto max-w-content px-5 py-[clamp(4rem,8vw,7rem)] sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
            </Reveal>
            <Reveal>
              <h2 className="max-w-[18ch] text-balance font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
                {t('heading')}
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-ink-60">
                {t('intro')}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {STEPS.map((step) => (
                <Reveal key={step.key}>
                  <div className="group relative border-t border-line pt-7">
                    <span
                      aria-hidden
                      className="absolute -top-px start-0 h-[2px] w-12 bg-saffron"
                    />
                    <div className="flex items-baseline gap-4">
                      <span className="font-heading text-[2rem] font-light italic leading-none text-saffron">
                        {step.n}
                      </span>
                      <h3 className="font-heading text-2xl font-light text-ink transition-colors group-hover:text-clay">
                        {t(
                          `steps.${step.key}.title` as Parameters<typeof t>[0],
                        )}
                      </h3>
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-ink-60">
                      {t(`steps.${step.key}.body` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
