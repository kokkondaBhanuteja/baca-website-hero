'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Menu, Plus, X } from 'lucide-react'

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const NAV: NavItem[] = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Who We Are', href: '/about#who-we-are' },
      { label: 'Vision & Mission', href: '/about#vision' },
      { label: 'Our Approach', href: '/about#approach' },
      { label: 'Management Team', href: '/about#team' },
      { label: 'Why Choose BACA', href: '/about#why' },
      { label: 'Our Brands', href: '/about#brands' },
    ],
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Spices', href: '/products/spices' },
      { label: 'Nuts', href: '/products/nuts' },
      { label: 'Fruits', href: '/products/fruits' },
      { label: 'View all categories', href: '/products' },
    ],
  },
  {
    label: 'Insights',
    href: '/blogs',
    children: [
      { label: 'Market Insights', href: '/blogs/industry-insights' },
      { label: 'Impact Stories', href: '/blogs/impact-stories' },
      { label: 'Community Engagement', href: '/blogs/community-engagement' },
    ],
  },
  {
    label: 'Gallery',
    href: '/gallery',
    children: [
      { label: 'Photos', href: '/gallery#photos' },
      { label: 'Videos', href: '/gallery#videos' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-line bg-paper/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1340px] items-center justify-between gap-6 px-5 sm:px-8">
        {/* Wordmark */}
        <a href="/" className="group flex items-baseline gap-2" aria-label="BACA home">
          <span
            className={`font-heading text-2xl font-medium tracking-tight transition-colors ${
              scrolled ? 'text-ink' : 'text-paper'
            }`}
          >
            BACA
          </span>
          <span
            className={`hidden font-mono text-[0.6rem] uppercase tracking-[0.22em] transition-colors sm:inline ${
              scrolled ? 'text-ink-60' : 'text-paper/70'
            }`}
          >
            Bharat Cargo
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={item.href}
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-colors ${
                  scrolled
                    ? 'text-ink/80 hover:text-ink'
                    : 'text-paper/85 hover:text-paper'
                }`}
              >
                {item.label}
                {item.children && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                )}
              </a>
              {item.children && (
                <div className="invisible absolute left-0 top-full min-w-56 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="overflow-hidden rounded-2xl border border-line bg-paper p-2 shadow-[0_18px_50px_-20px_rgba(20,24,26,0.35)]">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          className="block rounded-xl px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-bone hover:text-ink"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <span
            className={`hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors md:inline ${
              scrolled ? 'text-ink-60' : 'text-paper/70'
            }`}
          >
            EN
          </span>
          <a
            href="/contact"
            data-cursor="fill"
            className={`hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:inline-flex ${
              scrolled
                ? 'bg-ink text-paper hover:bg-forest'
                : 'bg-paper text-ink hover:bg-paper/90'
            }`}
          >
            Enquire
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden ${
              scrolled
                ? 'border-line text-ink'
                : 'border-paper/40 text-paper'
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink text-paper lg:hidden">
          <div className="flex h-[72px] items-center justify-between px-5 sm:px-8">
            <span className="font-heading text-2xl font-medium">BACA</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-paper"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav
            className="flex-1 overflow-y-auto px-5 pb-10 pt-4 sm:px-8"
            aria-label="Mobile"
          >
            <ul className="divide-y divide-paper/10">
              {NAV.map((item) => (
                <li key={item.label} className="py-1">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAccordion(
                            openAccordion === item.label ? null : item.label,
                          )
                        }
                        className="flex w-full items-center justify-between py-3 text-left font-heading text-3xl font-light"
                      >
                        {item.label}
                        <Plus
                          className={`h-5 w-5 transition-transform ${
                            openAccordion === item.label ? 'rotate-45' : ''
                          }`}
                        />
                      </button>
                      {openAccordion === item.label && (
                        <ul className="pb-3 pl-1">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <a
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 text-base text-paper/70"
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 font-heading text-3xl font-light"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-saffron px-6 py-4 text-base font-medium text-ink"
            >
              Enquire
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
