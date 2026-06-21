import { Compass, Target } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

/**
 * Profile page — paired Vision / Mission cards. Cream-on-paper card pattern
 * matching the contact-page panel + product-detail attribute cards.
 */
export async function VisionMission() {
  const t = await getTranslations('profilePage.visionMission')

  const cards = [
    { key: 'vision', icon: Compass },
    { key: 'mission', icon: Target },
  ] as const

  return (
    <section
      id="vision-mission"
      className="scroll-mt-header-offset bg-cream/40"
    >
      <div className="mx-auto max-w-content px-5 py-[clamp(4rem,8vw,7rem)] sm:px-8">
        <Reveal>
          <Eyebrow className="mb-4 text-ink-60">{t('eyebrow')}</Eyebrow>
        </Reveal>
        <Reveal>
          <h2 className="max-w-[22ch] text-balance font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">
            {t('heading')}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {cards.map(({ key, icon: Icon }) => (
            <Reveal key={key}>
              <div className="h-full rounded-3xl border border-line bg-paper p-6 sm:p-8 lg:p-10">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bone text-clay">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-light text-ink">
                  {t(`${key}.title` as Parameters<typeof t>[0])}
                </h3>
                <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-60">
                  {t(`${key}.body` as Parameters<typeof t>[0])}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
