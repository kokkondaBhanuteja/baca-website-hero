import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { PageIntro } from '@/components/shared/page-intro'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { WhoWeAre } from '@/components/sections/profile/who-we-are'
import { VisionMission } from '@/components/sections/profile/vision-mission'
import { HowWeWork } from '@/components/sections/profile/how-we-work'
import { Founders } from '@/components/sections/profile/founders'
import { WhyBaca } from '@/components/sections/profile/why-baca'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'profilePage',
  })
  return { title: `${t('heading')} — BACA`, description: t('intro') }
}

export default async function ProfilePage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('profilePage')

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(4rem,8vw,7rem)] sm:px-8">
          <PageIntro
            eyebrow={t('eyebrow')}
            heading={t('heading')}
            intro={t('intro')}
          />
        </section>
        <WhoWeAre />
        <VisionMission />
        <HowWeWork />
        <Founders />
        <WhyBaca />
      </main>
      <SiteFooter />
    </>
  )
}
