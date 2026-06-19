import { getTranslations } from 'next-intl/server'

import { CERTS } from '@/constants/sections/certifications'
import { Anchor } from '@/constants/routes'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

export async function Certifications() {
  const t = await getTranslations('certifications')

  return (
    <section id={Anchor.Compliance.slice(1)} className="bg-cream">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow data-reveal className="mb-4 text-ink-60">
              {t('eyebrow')}
            </Eyebrow>
            <h2
              data-reveal
              className="max-w-[18ch] text-balance font-heading text-[clamp(1.9rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink"
            >
              {t('heading')}
            </h2>
          </div>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink-60">
            {t('intro')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {CERTS.map((cert, i) => {
            const Icon = cert.icon
            return (
              <Reveal key={cert.key} delay={i * 60}>
                <div className="flex items-center gap-3 border-t border-line pt-5">
                  <Icon
                    className="h-8 w-8 shrink-0 text-saffron"
                    strokeWidth={1.4}
                    aria-hidden
                  />
                  <div>
                    <p className="font-heading text-lg font-light leading-tight text-ink">
                      {cert.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-60">
                      {t(`items.${cert.key}.sub` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
