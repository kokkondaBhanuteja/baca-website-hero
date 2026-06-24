'use client'

import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SITE, CERT_MARKS } from '@/constants/site'
import { CONTACT } from '@/constants/contact'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { ContactStrip } from '@/components/sections/contact/contact-strip'

interface SiteFooterProps {
  hideContactStrip?: boolean
}

interface ColItem {
  label: string
  href: string
  isLink: boolean
}

interface Col {
  title: string
  items: ColItem[]
}

export function SiteFooter({ hideContactStrip = false }: SiteFooterProps = {}) {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  const cols: Col[] = [
    {
      title: t('columns.products.title'),
      items: [
        {
          label: t('columns.products.links.all'),
          href: Route.Products,
          isLink: true,
        },
        {
          label: t('columns.products.links.spices'),
          href: Route.Products,
          isLink: true,
        },
        {
          label: t('columns.products.links.nutsSeeds'),
          href: Route.Products,
          isLink: true,
        },
        {
          label: t('columns.products.links.gallery'),
          href: Route.Gallery,
          isLink: true,
        },
      ],
    },
    {
      title: t('columns.company.title'),
      items: [
        {
          label: t('columns.company.links.about'),
          href: Route.Home,
          isLink: true,
        },
        {
          label: t('columns.company.links.insights'),
          href: Route.Blogs,
          isLink: true,
        },
        {
          label: t('columns.company.links.contact'),
          href: Route.Contact,
          isLink: true,
        },
      ],
    },
    {
      title: t('columns.reach.title'),
      items: [
        { label: CONTACT.email, href: CONTACT.emailHref, isLink: true },
        { label: CONTACT.phoneDisplay, href: CONTACT.phoneHref, isLink: true },
        {
          label: t('columns.reach.links.whatsapp'),
          href: CONTACT.whatsappUrl,
          isLink: true,
        },
      ],
    },
    {
      title: t('columns.certified.title'),
      items: [
        ...CERT_MARKS.map((c) => ({ label: c, href: '', isLink: false })),
        { label: t('columns.certified.spicesBoard'), href: '', isLink: false },
      ],
    },
  ]

  return (
    <>
      {!hideContactStrip && <ContactStrip />}

      <footer className="overflow-hidden bg-ink">
        {/* ── Nav columns ── */}
        <div className="mx-auto max-w-screen-xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-12">
            {cols.map((col) => (
              <div key={col.title}>
                <h3 className="mb-5 text-[0.85rem] font-medium text-paper/90">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      {item.isLink ? (
                        <Link
                          href={item.href}
                          className="text-[0.85rem] text-paper/55 transition-colors duration-200 hover:text-paper"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-[0.85rem] text-paper/40">
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider + legal bar ── */}
        <div className="border-t border-paper/10">
          <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper/30">
              <span>
                © {year} {SITE.brand}
              </span>
              <span className="text-paper/15" aria-hidden>
                ·
              </span>
              <span>{SITE.gst}</span>
              <span className="text-paper/15" aria-hidden>
                ·
              </span>
              <span>{SITE.iec}</span>
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 self-start font-mono text-[0.58rem] uppercase tracking-[0.16em] text-paper/30 transition-colors duration-200 hover:text-paper/70 sm:self-auto"
            >
              {t('backToTop')}
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-paper/15 transition-colors duration-200 group-hover:border-paper/40">
                <ArrowUp className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>

        {/* ── BACA wordmark ── */}
        <div className="overflow-hidden pb-10">
          <p
            className="select-none whitespace-nowrap text-center font-heading font-bold leading-none tracking-[-0.02em] text-paper"
            style={{ fontSize: 'clamp(4rem, 22vw, 24rem)' }}
            aria-hidden
          >
            {SITE.brand}
          </p>
        </div>
      </footer>
    </>
  )
}
