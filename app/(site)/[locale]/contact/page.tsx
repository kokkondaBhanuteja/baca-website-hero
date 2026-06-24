import type { Metadata } from 'next'
import { Mail, Phone, MessageCircle, Clock } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { CONTACT } from '@/constants/contact'
import { EnquiryForm } from '@/components/sections/contact/enquiry-form'
import { LocationMap } from '@/components/sections/contact/location-map'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

type PageParams = { params: Promise<{ locale: string }> }

const EXPECT_KEYS = ['specs', 'pricing', 'certifications', 'samples'] as const

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'contactPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('subheading') }
}

export default async function ContactPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('contactPage')

  const quickChannels = [
    {
      key: 'email',
      icon: Mail,
      label: t('channels.emailLabel'),
      value: CONTACT.email,
      href: CONTACT.emailHref,
      external: false,
    },
    {
      key: 'phone',
      icon: Phone,
      label: t('channels.phoneLabel'),
      value: CONTACT.phoneDisplay,
      href: CONTACT.phoneHref,
      external: false,
    },
    {
      key: 'whatsapp',
      icon: MessageCircle,
      label: t('channels.whatsapp'),
      value: t('channels.whatsappValue'),
      href: CONTACT.whatsappUrl,
      external: true,
    },
  ] as const

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-white pt-header-base">
        {/* ── Page hero ── */}
        <div className="border-b border-ink/8 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
            <p className="mb-4 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
              {t('eyebrow')}
            </p>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="font-heading text-[2.8rem] font-light leading-[1.08] text-ink sm:text-[3.6rem]">
                {t('heading')}
              </h1>

              {/* Quick-contact pills */}
              <div className="flex flex-wrap gap-2 sm:shrink-0">
                {quickChannels.map(
                  ({ key, icon: Icon, label, value, href, external }) => (
                    <a
                      key={key}
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-2.5 rounded-full border border-ink/12 bg-white px-4 py-2.5 text-[0.82rem] text-ink transition-colors duration-200 hover:border-forest hover:bg-cream"
                    >
                      <Icon
                        className="h-3.5 w-3.5 shrink-0 text-saffron"
                        aria-hidden
                      />
                      <span className="font-medium">{label}</span>
                      <span className="hidden text-ink/50 sm:inline">·</span>
                      <span className="hidden text-ink/70 sm:inline">
                        {value}
                      </span>
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Form section ── */}
        <div className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
              {/* Left: context + response promise */}
              <div className="flex flex-col gap-8">
                <div>
                  <p className="font-heading text-[1.5rem] font-light leading-[1.55] text-ink sm:text-[1.7rem]">
                    {t('intro.heading')}
                  </p>
                  <p className="mt-4 text-[0.95rem] leading-[1.85] text-ink/75">
                    {t('intro.body')}
                  </p>
                </div>

                {/* Response promise */}
                <div className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-cream p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-paper">
                    <Clock className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <p className="font-heading text-[1.05rem] font-light text-ink">
                      {t('promise.title')}
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-[1.7] text-ink/70">
                      {t('promise.body')}
                    </p>
                  </div>
                </div>

                {/* What to expect list */}
                <div className="divide-y divide-ink/8 border-t border-ink/8">
                  {EXPECT_KEYS.map((expectKey) => (
                    <div
                      key={expectKey}
                      className="flex items-start justify-between gap-4 py-3.5"
                    >
                      <p className="text-[0.88rem] font-medium text-ink">
                        {t(
                          `expect.items.${expectKey}.label` as Parameters<
                            typeof t
                          >[0],
                        )}
                      </p>
                      <p className="text-right text-[0.82rem] leading-[1.5] text-ink/60">
                        {t(
                          `expect.items.${expectKey}.detail` as Parameters<
                            typeof t
                          >[0],
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: the form in a clean card */}
              <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_2px_16px_rgba(30,58,23,0.06)] sm:p-8 lg:p-10">
                <EnquiryForm tone="light" />
              </div>
            </div>
          </div>
        </div>

        <LocationMap />
      </main>
      <SiteFooter hideContactStrip />
    </>
  )
}
