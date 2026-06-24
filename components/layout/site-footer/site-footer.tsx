'use client'

import { ArrowUp } from 'lucide-react'

import { SITE, CERT_MARKS } from '@/constants/site'
import { CONTACT } from '@/constants/contact'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { ContactStrip } from '@/components/sections/contact/contact-strip'

interface SiteFooterProps {
  hideContactStrip?: boolean
}

const COLS = [
  {
    title: 'Products',
    items: [
      { label: 'All Products', href: Route.Products, isLink: true },
      { label: 'Spices', href: Route.Products, isLink: true },
      { label: 'Nuts & Seeds', href: Route.Products, isLink: true },
      { label: 'Gallery', href: Route.Gallery, isLink: true },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About BACA', href: Route.Home, isLink: true },
      { label: 'Insights', href: Route.Blogs, isLink: true },
      { label: 'Contact', href: Route.Contact, isLink: true },
    ],
  },
  {
    title: 'Reach Us',
    items: [
      { label: CONTACT.email, href: CONTACT.emailHref, isLink: true },
      { label: CONTACT.phoneDisplay, href: CONTACT.phoneHref, isLink: true },
      { label: 'WhatsApp', href: CONTACT.whatsappUrl, isLink: true },
    ],
  },
  {
    title: 'Certified',
    items: [
      ...CERT_MARKS.map((c) => ({ label: c, href: '', isLink: false })),
      { label: 'Spices Board CRES', href: '', isLink: false },
    ],
  },
] as const

export function SiteFooter({ hideContactStrip = false }: SiteFooterProps = {}) {
  const year = new Date().getFullYear()

  return (
    <>
      {!hideContactStrip && <ContactStrip />}

      <footer className="overflow-hidden bg-ink">
        {/* ── Nav columns ── */}
        <div className="mx-auto max-w-screen-xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-12">
            {COLS.map((col) => (
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
              Back to top
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
