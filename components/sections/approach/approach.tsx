'use client'

import { useTranslations } from 'next-intl'

import { PILLARS } from '@/constants/sections/approach'

export function Approach() {
  const t = useTranslations('approach')

  const top = PILLARS.slice(0, 3)
  const bottom = PILLARS.slice(3)

  return (
    <section
      id="approach"
      className="scroll-mt-header-offset bg-white py-14 sm:py-20"
    >
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        {/* Section header */}
        <div className="mb-12">
          <p className="mb-3 font-mono text-[0.75rem] uppercase tracking-[0.35em] text-[#2E0F13]/75">
            {t('eyebrow')}
          </p>
          <h2 className="font-heading max-w-3xl text-[2.4rem] font-light leading-[1.08] text-[#2E0F13] sm:text-[3rem]">
            {t('heading')}
          </h2>
        </div>

        {/* ── Row 1: 3 items ── */}
        <div className="grid grid-cols-1 border-t border-[#2E0F13]/12 sm:grid-cols-3">
          {top.map((pillar, idx) => (
            <div
              key={pillar.key}
              className={`group relative flex flex-col py-8 sm:py-10 ${idx > 0 ? 'sm:border-l sm:border-[#2E0F13]/12 sm:pl-8' : ''}`}
            >
              <div className="mb-5 h-[2px] w-full bg-[#2E0F13]/10 transition-colors duration-300 group-hover:bg-[#8B3A1A]" />

              <div className="mb-5 flex items-baseline gap-2">
                <span className="font-heading text-[3rem] font-light leading-none text-[#8B3A1A]">
                  {pillar.n}
                </span>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#8B3A1A]/60">
                  Step
                </span>
              </div>

              <h3 className="font-heading mb-4 text-[1.5rem] font-light leading-[1.2] text-[#2E0F13] transition-colors duration-300 group-hover:text-[#8B3A1A] sm:text-[1.65rem]">
                {t(`pillars.${pillar.key}.title` as Parameters<typeof t>[0])}
              </h3>

              <div className="mb-4 h-px w-8 bg-[#2E0F13]/20 transition-colors duration-300 group-hover:bg-[#8B3A1A]/50" />

              <p className="text-[0.9rem] leading-[1.85] text-[#2E0F13]/60">
                {t(`pillars.${pillar.key}.body` as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>

        {/* ── Row 2: 2 items centered (leave 1/6 gap each side) ── */}
        <div className="grid grid-cols-1 border-t border-[#2E0F13]/12 sm:grid-cols-6">
          {bottom.map((pillar, idx) => (
            <div
              key={pillar.key}
              className={`group relative flex flex-col py-8 sm:col-span-2 sm:py-10 ${idx === 0 ? 'sm:col-start-2' : 'sm:border-l sm:border-[#2E0F13]/12 sm:pl-8'}`}
            >
              <div className="mb-5 h-[2px] w-full bg-[#2E0F13]/10 transition-colors duration-300 group-hover:bg-[#8B3A1A]" />

              <div className="mb-5 flex items-baseline gap-2">
                <span className="font-heading text-[3rem] font-light leading-none text-[#8B3A1A]">
                  {pillar.n}
                </span>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[#8B3A1A]/60">
                  Step
                </span>
              </div>

              <h3 className="font-heading mb-4 text-[1.5rem] font-light leading-[1.2] text-[#2E0F13] transition-colors duration-300 group-hover:text-[#8B3A1A] sm:text-[1.65rem]">
                {t(`pillars.${pillar.key}.title` as Parameters<typeof t>[0])}
              </h3>

              <div className="mb-4 h-px w-8 bg-[#2E0F13]/20 transition-colors duration-300 group-hover:bg-[#8B3A1A]/50" />

              <p className="text-[0.9rem] leading-[1.85] text-[#2E0F13]/60">
                {t(`pillars.${pillar.key}.body` as Parameters<typeof t>[0])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
