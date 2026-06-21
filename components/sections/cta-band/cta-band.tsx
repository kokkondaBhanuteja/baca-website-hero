import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { CtaLink } from '@/components/ui/cta-link'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Reveal } from '@/components/ui/reveal'
import { richTags } from '@/components/ui/rich'

export async function CtaBand() {
  const t = await getTranslations('ctaBand')

  return (
    <section className="bg-forest text-paper">
      <div className="mx-auto max-w-[1080px] px-5 py-[clamp(4rem,8vw,7rem)] text-center sm:px-8">
        <Reveal>
          <Eyebrow className="mb-6 justify-center text-paper/60">
            {t('eyebrow')}
          </Eyebrow>
          <h2 className="mx-auto max-w-[20ch] text-balance font-heading text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em] text-paper">
            {t.rich('heading', richTags)}
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-[15px] leading-relaxed text-paper/75">
            {t('body')}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <CtaLink href={Route.Contact} tone="dark" size="lg" arrow>
              {t('ctaEnquire')}
            </CtaLink>
            <CtaLink
              href={Route.Products}
              variant="outline"
              tone="dark"
              size="lg"
            >
              {t('ctaCatalogue')}
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
