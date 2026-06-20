import { getTranslations } from 'next-intl/server'

import { Reveal } from '@/components/ui/reveal'

export async function PullQuote() {
  const t = await getTranslations('pullQuote')

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1080px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal>
          <figure>
            <blockquote className="text-balance font-heading text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.18] tracking-[-0.02em] text-ink">
              <span className="text-saffron">“</span>
              {t('quote')}
              <span className="text-saffron">”</span>
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-4">
              <img
                src="/images/portrait-md.jpg"
                alt={t('imageAlt')}
                className="h-14 w-14 rounded-full object-cover object-[50%_15%] grayscale"
              />
              <div>
                <p className="font-heading text-lg font-light text-ink">
                  {t('name')}
                </p>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-60">
                  {t('title')}
                </p>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
