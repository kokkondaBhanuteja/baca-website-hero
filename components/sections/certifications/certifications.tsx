import { getTranslations } from 'next-intl/server'

import { CERTS } from '@/constants/sections/certifications'
import { Anchor } from '@/constants/routes'

export async function Certifications() {
  const t = await getTranslations('certifications')

  return (
    <section
      id={Anchor.Compliance.slice(1)}
      className="bg-cream py-16 sm:py-20"
    >
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[0.75rem] uppercase tracking-[0.35em] text-[#2E0F13]/60">
              {t('eyebrow')}
            </p>
            <h2 className="font-heading text-[2rem] font-light leading-[1.06] text-[#2E0F13] sm:text-[2.4rem]">
              {t('heading')}
            </h2>
          </div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#2E0F13]/40">
            {t('intro')}
          </p>
        </div>

        {/* Certs — horizontal divider rows */}
        <div className="grid grid-cols-2 divide-x divide-y divide-[#2E0F13]/10 border border-[#2E0F13]/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          {CERTS.map((cert) => (
            <div
              key={cert.key}
              className="group flex flex-col gap-2 px-6 py-8 transition-colors duration-300 hover:bg-white"
            >
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#8B3A1A]/70">
                {cert.authority}
              </p>
              <h3 className="font-heading text-[1.6rem] font-light leading-none text-[#2E0F13] sm:text-[1.8rem]">
                {cert.name}
              </h3>
              <div className="h-px w-6 bg-[#2E0F13]/15 transition-colors duration-300 group-hover:bg-[#8B3A1A]/40" />
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#2E0F13]/45">
                {t(`items.${cert.key}.sub` as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
