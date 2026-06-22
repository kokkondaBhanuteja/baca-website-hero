import { useTranslations } from 'next-intl'

import { CONTACT } from '@/constants/contact'
import { SITE } from '@/constants/site'
import { FOOTER_COLUMNS } from '@/constants/sections/footer'

import { FooterLink } from '@/components/layout/site-footer/footer-link'

/**
 * Middle body of the footer. Renders the brand block (display-sized wordmark
 * + description + address + email/phone) on the left (col-span-5) and
 * three nav columns (Products / Company / Resources) on the right (col-span-7
 * split into 3 even cols on lg+).
 *
 * Every block opts into the parent's `[data-footer-reveal]` GSAP selector.
 * Must be rendered inside a next-intl provider since it calls `useTranslations`.
 */
export function FooterColumns() {
  const t = useTranslations('footer')

  return (
    <div className="py-12 lg:py-14">
      {/* Brand + nav columns */}
      <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <div data-footer-reveal className="lg:col-span-5">
          {/* Brand wordmark — display-sized letters in the heading face;
             anchors the brand column visually. */}
          <p className="font-heading text-[clamp(3.5rem,7vw,5.5rem)] font-light leading-none tracking-[-0.03em] text-paper">
            {SITE.brand}
          </p>
          <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-paper/65">
            {t('description')}
          </p>
          <address className="mt-5 not-italic text-[13px] leading-relaxed text-paper/55">
            {SITE.address[0]}
            <br />
            {SITE.address[1]}
          </address>
          <div className="mt-4 flex flex-col gap-1 text-[13px] leading-relaxed text-paper/55 sm:flex-row sm:items-center sm:gap-3">
            <a
              href={CONTACT.emailHref}
              className="transition-colors hover:text-paper"
            >
              {CONTACT.email}
            </a>
            <span aria-hidden className="hidden text-paper/25 sm:inline">
              ·
            </span>
            <a
              href={CONTACT.phoneHref}
              className="transition-colors hover:text-paper"
            >
              {CONTACT.phoneDisplay}
            </a>
          </div>
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
      </div>
    </div>
  )
}
