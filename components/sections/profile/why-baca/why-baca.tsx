import { getTranslations } from 'next-intl/server'

import { WHY_BACA } from '@/constants/sections/why-baca'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

/**
 * Profile page — "Why BACA" four-up icon grid. Each card surfaces one
 * differentiator (traceability / quality / logistics / partnership) with a
 * lucide icon, translated title, translated body.
 */
export async function WhyBaca() {
  const t = await getTranslations('profilePage.whyBaca')

  return (
    <section id="why-baca" className="scroll-mt-header-offset bg-paper">
      <div className="mx-auto max-w-content px-5 py-[clamp(4rem,8vw,7rem)] sm:px-8">
        <div className="max-w-[44ch]">
          <Reveal>
            <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
          </Reveal>
          <Reveal>
            <h2 className="text-balance font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
              {t('heading')}
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-60">
              {t('intro')}
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {WHY_BACA.map(({ key, icon: Icon }) => (
            <li key={key}>
              <Reveal>
                <article className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-paper p-5 sm:p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bone text-clay">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-heading text-lg font-light text-ink">
                    {t(`items.${key}.title` as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-ink-60">
                    {t(`items.${key}.body` as Parameters<typeof t>[0])}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
