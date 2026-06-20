import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
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
            <Link
              href={Route.Contact}
              data-cursor="fill"
              className="group inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              {t('ctaEnquire')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={Route.Products}
              data-cursor="fill"
              className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
            >
              {t('ctaCatalogue')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
