import { getTranslations } from 'next-intl/server'

import { FOUNDERS } from '@/constants/sections/founders'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'

/**
 * Profile page — Founders grid. Each card shows an avatar (image when the
 * constant supplies `imageUrl`, otherwise an initials chip on a saffron tile),
 * the founder's proper-noun name, and a translated role + bio.
 */
export async function Founders() {
  const t = await getTranslations('profilePage.founders')

  return (
    <section id="founders" className="scroll-mt-header-offset bg-cream/40">
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

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {FOUNDERS.map((founder) => {
            const initial = founder.name.charAt(0).toUpperCase()
            return (
              <li key={founder.key}>
                <Reveal>
                  <article className="flex h-full flex-col gap-5 rounded-3xl border border-line bg-paper p-6 sm:flex-row sm:gap-6 sm:p-8">
                    {founder.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={founder.imageUrl}
                        alt={`${t('imageAltPrefix')} ${founder.name}`}
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-saffron/20 font-heading text-3xl font-light text-clay"
                      >
                        {initial}
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-heading text-xl font-light text-ink">
                        {founder.name}
                      </h3>
                      <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
                        {t(
                          `items.${founder.key}.role` as Parameters<
                            typeof t
                          >[0],
                        )}
                      </p>
                      <p className="mt-4 text-[14px] leading-relaxed text-ink/80">
                        {t(
                          `items.${founder.key}.bio` as Parameters<typeof t>[0],
                        )}
                      </p>
                    </div>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
