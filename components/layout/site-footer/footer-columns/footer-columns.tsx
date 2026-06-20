import { useTranslations } from 'next-intl'

import { CONTACT } from '@/constants/contact'
import { CERT_MARKS, SITE } from '@/constants/site'
import { FOOTER_COLUMNS } from '@/constants/sections/footer'

import { FooterLink } from '@/components/layout/site-footer/footer-link'

/**
 * Middle grid of the footer: the description + address block, the localized nav
 * columns, and the certifications strip. Every block opts into the parent's
 * `[data-footer-reveal]` GSAP scroll-reveal selector.
 *
 * Must be rendered inside a next-intl provider since it calls `useTranslations`.
 */
export function FooterColumns() {
  const t = useTranslations('footer')

  return (
    <div className="grid gap-x-8 gap-y-10 py-10 lg:grid-cols-12 lg:py-12">
      <div data-footer-reveal className="lg:col-span-5">
        <p className="max-w-[42ch] text-sm leading-relaxed text-paper/65">
          {t('description')}
        </p>
        <address className="mt-4 not-italic text-[13px] leading-relaxed text-paper/55">
          {SITE.address[0]} · {SITE.address[1]}
          <br />
          <a
            href={CONTACT.emailHref}
            className="transition-colors hover:text-paper"
          >
            {CONTACT.email}
          </a>
          {' · '}
          <a
            href={CONTACT.phoneHref}
            className="transition-colors hover:text-paper"
          >
            {CONTACT.phoneDisplay}
          </a>
        </address>
      </div>

      {FOOTER_COLUMNS.map((col) => {
        const titleKey = `columns.${col.key}.title` as Parameters<typeof t>[0]
        return (
          <nav
            key={col.key}
            data-footer-reveal
            className="lg:col-span-2"
            aria-label={t(titleKey)}
          >
            <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/60">
              {t(titleKey)}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {col.links.map((link) => {
                const linkKey =
                  `columns.${col.key}.links.${link.key}` as Parameters<
                    typeof t
                  >[0]
                return (
                  <li key={link.key}>
                    <FooterLink href={link.href}>{t(linkKey)}</FooterLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        )
      })}

      <div data-footer-reveal className="lg:col-span-1">
        <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/60">
          {t('certifiedTitle')}
        </h3>
        <ul className="mt-5 flex flex-col gap-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-paper/55">
          {CERT_MARKS.map((mark) => (
            <li key={mark}>{mark}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
