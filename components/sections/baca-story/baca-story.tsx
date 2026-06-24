import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { FoundersNote } from '@/components/sections/founders-note'

const STAT_KEYS = ['production', 'farmers', 'exports'] as const
const PRINCIPLE_KEYS = ['farmer', 'quality', 'partnership'] as const

export async function BacaStory() {
  const t = await getTranslations('bacaStory')

  return (
    <section>
      {/* ── Block 1: Origin story + stats ── */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <p className="mb-8 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
            {t('origin.eyebrow')}
          </p>

          <div className="grid grid-cols-1 gap-8 border-t border-ink/15 pt-8 lg:grid-cols-2 lg:gap-16">
            <h2 className="font-heading text-[2.6rem] font-light leading-[1.08] tracking-[0.01em] text-ink sm:text-[3.2rem] lg:text-[3.6rem]">
              {t('origin.heading')}
              <br />
              <span className="text-ink/60">{t('origin.headingAccent')}</span>
            </h2>

            <div className="flex flex-col justify-center gap-5">
              <p className="text-[1.05rem] leading-[1.9] text-ink">
                {t('origin.body')}
              </p>
              <p className="border-l-2 border-saffron pl-5 text-[1.05rem] italic leading-[1.8] text-ink">
                {t('origin.quote')}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/15 pt-8">
            {STAT_KEYS.map((statKey, index) => (
              <div
                key={statKey}
                className={
                  index > 0 ? 'border-l border-ink/15 pl-4 sm:pl-8' : ''
                }
              >
                <p className="font-heading text-[2.2rem] font-light leading-none text-forest sm:text-[2.8rem]">
                  {t(
                    `stats.items.${statKey}.figure` as Parameters<typeof t>[0],
                  )}
                </p>
                <p className="mt-2 text-[0.88rem] leading-[1.65] text-ink sm:text-[0.92rem]">
                  {t(`stats.items.${statKey}.label` as Parameters<typeof t>[0])}
                </p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink/60">
                  {t(
                    `stats.items.${statKey}.source` as Parameters<typeof t>[0],
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Block 2: Vision & Mission (dark forest) ── */}
      <div className="bg-forest py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <div className="mb-10 flex items-center gap-6">
            <p className="font-mono text-[0.78rem] uppercase tracking-[0.35em] text-lime">
              {t('purpose.eyebrow')}
            </p>
            <div className="h-px flex-1 bg-paper/20" />
          </div>

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            <div className="border-b border-paper/20 pb-8 sm:border-b-0 sm:border-r sm:border-paper/20 sm:pb-0 sm:pr-10 lg:pr-16">
              <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-lime">
                {t('purpose.vision.title')}
              </p>
              <p className="font-heading text-[1.6rem] font-light leading-[1.55] text-paper sm:text-[1.8rem] lg:text-[2rem]">
                {t('purpose.vision.body')}
              </p>
            </div>

            <div className="pt-8 sm:pl-10 sm:pt-0 lg:pl-16">
              <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-lime">
                {t('purpose.mission.title')}
              </p>
              <p className="font-heading text-[1.6rem] font-light leading-[1.55] text-paper sm:text-[1.8rem] lg:text-[2rem]">
                {t('purpose.mission.body')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Block 3: Our Principles — numbered list left, sticky image right ── */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <p className="mb-8 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
            {t('principles.eyebrow')}
          </p>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-14 xl:grid-cols-[1fr_460px]">
            {/* Principles list */}
            <div className="divide-y divide-ink/10 border-t border-ink/10">
              {PRINCIPLE_KEYS.map((principleKey, index) => (
                <div
                  key={principleKey}
                  className="group grid grid-cols-[4rem_1fr] gap-6 py-9 sm:gap-10"
                >
                  <div className="pt-1">
                    <span className="font-heading block text-[3.5rem] font-light leading-none text-forest/20 sm:text-[4rem]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="font-heading text-[1.9rem] font-light leading-[1.1] text-ink transition-colors duration-300 group-hover:text-forest sm:text-[2.2rem]">
                      {t(
                        `principles.items.${principleKey}.title` as Parameters<
                          typeof t
                        >[0],
                      )}
                    </h3>
                    <div className="h-px w-8 bg-ink/25 transition-colors duration-300 group-hover:bg-saffron" />
                    <p className="text-[1rem] leading-[1.85] text-ink sm:text-[1.05rem]">
                      {t(
                        `principles.items.${principleKey}.body` as Parameters<
                          typeof t
                        >[0],
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky image */}
            <div className="hidden lg:block">
              <div className="sticky top-[calc(var(--spacing-header-base)+2rem)]">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="relative h-[520px] w-full xl:h-[580px]">
                    <Image
                      src="/images/who-we-are.jpg"
                      alt={t('principles.imageAlt')}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1280px) 400px, 460px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/80">
                        {t('principles.imageCaption')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Block 4: Founders voices ── */}
      <FoundersNote />
    </section>
  )
}
