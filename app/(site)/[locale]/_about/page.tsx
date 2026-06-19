import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { ABOUT_COMMITMENTS } from '@/constants/sections/commitments'
import { Link } from '@/i18n/navigation'
import { PageIntro } from '@/components/shared/page-intro'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'aboutPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('lead') }
}

export default async function AboutPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('aboutPage')

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-[72px]">
        <section className="mx-auto max-w-[1340px] px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <PageIntro
            eyebrow={t('eyebrow')}
            heading={t('heading')}
            intro={t('lead')}
          />

          <div className="mt-16">
            <h2 className="font-heading text-2xl font-light text-ink">
              {t('commitmentsTitle')}
            </h2>
            <ul className="mt-6 grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {ABOUT_COMMITMENTS.map((key, index) => (
                <li key={key} className="flex gap-4 border-t border-line pt-4">
                  <span className="font-heading text-lg font-light italic text-saffron">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[15px] leading-relaxed text-ink/75">
                    {t(`commitments.${key}` as Parameters<typeof t>[0])}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-20 rounded-2xl border border-line bg-cream p-10 text-center sm:p-14">
            <h2 className="mx-auto max-w-[22ch] text-balance font-heading text-[clamp(1.6rem,3.5vw,2.5rem)] font-light leading-[1.1] text-ink">
              {t('ctaHeading')}
            </h2>
            <Link
              href={Route.Contact}
              data-cursor="fill"
              className="mt-7 inline-flex rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
            >
              {t('ctaButton')}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
