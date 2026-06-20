import type { Metadata } from 'next'
import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react'
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

  const channels = [
    {
      key: 'email',
      icon: Mail,
      label: t('channels.email'),
      value: CONTACT.email,
      href: CONTACT.emailHref,
    },
    {
      key: 'phone',
      icon: Phone,
      label: t('channels.phone'),
      value: CONTACT.phoneDisplay,
      href: CONTACT.phoneHref,
    },
    {
      key: 'whatsapp',
      icon: MessageCircle,
      label: t('channels.whatsapp'),
      value: t('channels.whatsappAction'),
      href: CONTACT.whatsappUrl,
    },
  ] as const

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* LEFT: intro + contact channels + office */}
            <div className="lg:col-span-5">
              <PageIntro
                eyebrow={t('eyebrow')}
                heading={t('heading')}
                intro={t('intro')}
              />

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {channels.map(({ key, icon: Icon, label, value, href }) => (
                  <a
                    key={key}
                    href={href}
                    target={key === 'whatsapp' ? '_blank' : undefined}
                    rel={key === 'whatsapp' ? 'noopener noreferrer' : undefined}
                    data-cursor="fill"
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-ink/30"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bone text-ink transition-colors group-hover:bg-saffron/20">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
                        {label}
                      </p>
                      <p className="truncate font-medium text-ink">{value}</p>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-ink-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-saffron"
                      aria-hidden
                    />
                  </a>
                ))}
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
                  {t('officeTitle')}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">
                  {SITE.address[0]}
                  <br />
                  {SITE.address[1]}
                </p>
              </div>
            </div>

            {/* RIGHT: enquiry form */}
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
