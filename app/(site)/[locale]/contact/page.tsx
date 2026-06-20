import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { CONTACT } from '@/constants/contact'
import { SITE } from '@/constants/site'
import { PageIntro } from '@/components/shared/page-intro'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { EnquiryForm } from '@/components/sections/contact/enquiry-form'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'contactPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('intro') }
}

export default async function ContactPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('contactPage')

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-[72px]">
        <section className="mx-auto max-w-[1340px] px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <PageIntro
                eyebrow={t('eyebrow')}
                heading={t('heading')}
                intro={t('intro')}
              />
              <div className="mt-10">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-60">
                  {t('detailsTitle')}
                </p>
                <div className="mt-4 space-y-2 text-sm text-ink/80">
                  <a href={CONTACT.emailHref} className="block hover:text-clay">
                    {CONTACT.email}
                  </a>
                  <a href={CONTACT.phoneHref} className="block hover:text-clay">
                    {CONTACT.phoneDisplay}
                  </a>
                  <p className="pt-1 text-ink-60">
                    {SITE.address[0]}
                    <br />
                    {SITE.address[1]}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <EnquiryForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
