'use client'

import { Mail, Phone, MessageCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CONTACT } from '@/constants/contact'
import { EnquiryForm } from '@/components/sections/contact/enquiry-form'

export function ContactStrip() {
  const t = useTranslations('contactStrip')
  const tChannels = useTranslations('contactPage.channels')

  return (
    <section aria-label={t('ariaSection')} className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          {/* ── Left: trust framing ── */}
          <div className="flex flex-col justify-between gap-12">
            <div>
              <p className="mb-4 font-mono text-[0.75rem] uppercase tracking-[0.35em] text-[#2E0F13]/60">
                {t('eyebrow')}
              </p>
              <h2 className="font-heading mb-6 text-[2.4rem] font-light leading-[1.06] text-[#2E0F13] sm:text-[3rem]">
                {t('headingPrefix')}
                <br />
                <em className="not-italic text-[#8B3A1A]">
                  {t('headingAccent')}
                </em>
              </h2>
              <p className="max-w-sm text-[0.95rem] leading-[1.9] text-[#2E0F13]/60">
                {t('body')}
              </p>
            </div>

            {/* Contact channels */}
            <div className="divide-y divide-[#2E0F13]/10 border-y border-[#2E0F13]/10">
              <a
                href={CONTACT.emailHref}
                className="group flex items-center gap-4 py-5 transition-colors hover:text-[#8B3A1A]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2E0F13]/12 text-[#2E0F13]/50 transition-colors group-hover:border-[#8B3A1A]/40 group-hover:text-[#8B3A1A]">
                  <Mail size={15} />
                </div>
                <div>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#2E0F13]/40">
                    {tChannels('email')}
                  </p>
                  <p className="font-heading text-[1.05rem] font-light text-[#2E0F13] transition-colors group-hover:text-[#8B3A1A]">
                    {CONTACT.email}
                  </p>
                </div>
              </a>

              <a
                href={CONTACT.phoneHref}
                className="group flex items-center gap-4 py-5 transition-colors hover:text-[#8B3A1A]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2E0F13]/12 text-[#2E0F13]/50 transition-colors group-hover:border-[#8B3A1A]/40 group-hover:text-[#8B3A1A]">
                  <Phone size={15} />
                </div>
                <div>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#2E0F13]/40">
                    {tChannels('phone')}
                  </p>
                  <p className="font-heading text-[1.05rem] font-light text-[#2E0F13] transition-colors group-hover:text-[#8B3A1A]">
                    {CONTACT.phoneDisplay}
                  </p>
                </div>
              </a>

              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-5 transition-colors hover:text-[#8B3A1A]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2E0F13]/12 text-[#2E0F13]/50 transition-colors group-hover:border-[#8B3A1A]/40 group-hover:text-[#8B3A1A]">
                  <MessageCircle size={15} />
                </div>
                <div>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#2E0F13]/40">
                    {tChannels('whatsapp')}
                  </p>
                  <p className="font-heading text-[1.05rem] font-light text-[#2E0F13] transition-colors group-hover:text-[#8B3A1A]">
                    {tChannels('whatsappValue')}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="rounded-2xl border border-[#2E0F13]/10 bg-cream p-8 sm:p-10">
            <EnquiryForm tone="light" />
          </div>
        </div>
      </div>
    </section>
  )
}
