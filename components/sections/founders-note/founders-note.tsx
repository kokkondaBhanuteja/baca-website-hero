'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const FOUNDER_KEYS = ['arjun', 'priya', 'rajan'] as const

export function FoundersNote() {
  const t = useTranslations('foundersNote')
  const [activeIndex, setActiveIndex] = useState(0)
  const [fading, setFading] = useState(false)

  function goTo(nextIndex: number) {
    if (nextIndex === activeIndex) return
    setFading(true)
    setTimeout(() => {
      setActiveIndex(nextIndex)
      setFading(false)
    }, 220)
  }

  const activeKey = FOUNDER_KEYS[activeIndex]
  const tField = (key: string) =>
    t(`items.${activeKey}.${key}` as Parameters<typeof t>[0])

  return (
    <div className="bg-[#d9d9d8] py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        <p className="mb-12 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
          {t('eyebrow')}
        </p>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[280px_1fr] lg:gap-24">
          {/* Founder selector */}
          <div className="flex flex-row gap-4 lg:flex-col lg:gap-0 lg:divide-y lg:divide-ink/10 lg:border-y lg:border-ink/10">
            {FOUNDER_KEYS.map((founderKey, index) => (
              <button
                key={founderKey}
                onClick={() => goTo(index)}
                className={`group relative flex items-center gap-4 text-left transition-all duration-300 lg:py-7 ${
                  index === activeIndex
                    ? 'opacity-100'
                    : 'opacity-30 hover:opacity-55'
                }`}
              >
                {/* Active bar */}
                <span
                  className={`absolute -left-6 hidden h-full w-[3px] rounded-r bg-saffron transition-opacity duration-300 lg:block ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Avatar */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    index === activeIndex
                      ? 'bg-forest text-paper'
                      : 'bg-ink/8 text-ink'
                  }`}
                >
                  <span className="font-heading text-[1rem] font-light leading-none">
                    {t(
                      `items.${founderKey}.initials` as Parameters<typeof t>[0],
                    )}
                  </span>
                </div>

                {/* Name + role — desktop only */}
                <div className="hidden lg:block">
                  <p className="font-heading text-[1.15rem] font-light text-ink">
                    {t(`items.${founderKey}.name` as Parameters<typeof t>[0])}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink/70">
                    {t(`items.${founderKey}.role` as Parameters<typeof t>[0])}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Quote panel */}
          <div
            className={`transition-opacity duration-[220ms] ${fading ? 'opacity-0' : 'opacity-100'}`}
          >
            <div
              className="font-heading -mb-4 text-[6rem] leading-none text-forest/15 sm:text-[8rem]"
              aria-hidden
            >
              &ldquo;
            </div>

            <blockquote className="font-heading text-[1.8rem] font-light italic leading-[1.7] text-ink sm:text-[2.2rem]">
              {tField('note')}
            </blockquote>

            <div className="mt-10 flex items-center gap-5">
              <div className="h-px w-10 bg-saffron/60" />
              <div>
                <p className="font-heading text-[1.2rem] font-light text-ink">
                  {tField('name')}
                </p>
                <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink/70">
                  {tField('role')}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              {FOUNDER_KEYS.map((founderKey, index) => (
                <button
                  key={founderKey}
                  onClick={() => goTo(index)}
                  aria-label={t('aria.founderIndex', { index: index + 1 })}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-saffron'
                      : 'w-2 bg-ink/15 hover:bg-ink/35'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
