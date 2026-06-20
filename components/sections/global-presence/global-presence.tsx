import { getTranslations } from 'next-intl/server'

import { REVEAL_STAGGER_MS } from '@/constants/animations'
import { REGIONS } from '@/constants/sections/regions'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'
import { richTags } from '@/components/ui/rich'

export async function GlobalPresence() {
  const t = await getTranslations('globalPresence')

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <img
        src="/images/global-port.jpg"
        alt=""
        aria-hidden
        data-parallax
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/35"
        aria-hidden
      />
      <div className="relative mx-auto max-w-content px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal className="max-w-[40ch]">
          <Eyebrow className="mb-5 text-paper/60">{t('eyebrow')}</Eyebrow>
          <h2 className="text-balance font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-paper">
            {t.rich('heading', richTags)}
          </h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">
            {t('body')}
          </p>
        </Reveal>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {REGIONS.map((region, index) => (
            <Reveal
              key={region.key}
              delay={index * REVEAL_STAGGER_MS.GLOBAL_PRESENCE}
            >
              <dt className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-light leading-none tracking-[-0.03em] text-paper">
                {region.value}
              </dt>
              <dd className="mt-4 border-t border-paper/15 pt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper/55">
                {t(`items.${region.key}` as Parameters<typeof t>[0])}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
