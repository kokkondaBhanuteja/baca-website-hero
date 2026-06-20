'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Menu, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { NAV } from '@/constants/sections/nav'
import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export interface NavLink {
  label: string
  href: string
}

interface NavItem {
  key: string
  label: string
  href: string
  children?: NavLink[]
}

export function SiteHeaderClient({
  forceSolid = false,
  productLinks,
  insightLinks,
}: {
  forceSolid?: boolean
  productLinks: NavLink[]
  insightLinks: NavLink[]
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  // Inner pages sit on a light background, so the header must show its solid
  // (dark-on-paper) treatment immediately rather than the over-hero transparent one.
  const scrolled = forceSolid || isScrolled

  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const tBlogs = useTranslations('blogsPage')

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
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

  // Build the nav: About/Contact are plain links; Products/Insights become
  // dropdowns populated with the top 3 live items (+ a "view all" entry).
  const navItems: NavItem[] = NAV.map((item) => {
    const label = tNav(`items.${item.key}.label` as Parameters<typeof tNav>[0])
    if (item.key === 'products' && productLinks.length > 0) {
      return {
        key: item.key,
        label,
        href: item.href,
        children: [
          ...productLinks,
          { label: tCommon('viewAllCategories'), href: Route.Products },
        ],
      }
    }
    if (item.key === 'insights' && insightLinks.length > 0) {
      return {
        key: item.key,
        label,
        href: item.href,
        children: [
          ...insightLinks,
          { label: tBlogs('allArticles'), href: Route.Blogs },
        ],
      }
    }
    return { key: item.key, label, href: item.href }
  })

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? 'border-b border-line bg-paper/95'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1340px] items-center justify-between gap-6 px-5 sm:px-8">
          {/* Wordmark */}
          <Link
            href={Route.Home}
            className="group flex items-baseline gap-2"
            aria-label={tHeader('aria.home')}
          >
            <span
              className={`font-heading text-2xl font-medium tracking-tight transition-colors ${
                scrolled ? 'text-ink' : 'text-paper'
              }`}
            >
              {SITE.brand}
            </span>
            <span
              className={`hidden font-mono text-[0.6rem] uppercase tracking-[0.22em] transition-colors sm:inline ${
                scrolled ? 'text-ink-60' : 'text-paper/70'
              }`}
            >
              {SITE.sub}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <div key={item.key} className="group relative">
                <Link
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
                </Link>
                {item.children && (
                  <div className="invisible absolute start-0 top-full min-w-60 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="overflow-hidden rounded-2xl border border-line bg-paper p-2 shadow-[0_18px_50px_-20px_rgba(20,24,26,0.35)]">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-xl px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-bone hover:text-ink"
                          >
                            {child.label}
                          </Link>
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
            <LanguageSwitcher
              tone={scrolled ? 'ink' : 'paper'}
              className="hidden md:inline-flex"
            />
            <Link
              href={Route.Contact}
              data-cursor="fill"
              className={`hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:inline-flex ${
                scrolled
                  ? 'bg-ink text-paper hover:bg-forest'
                  : 'bg-paper text-ink hover:bg-paper/90'
              }`}
            >
              {tCommon('enquire')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={tHeader('aria.openMenu')}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden ${
                scrolled ? 'border-line text-ink' : 'border-paper/40 text-paper'
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay — rendered OUTSIDE the header so the scrolled
          header's backdrop-filter can't trap this fixed overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper lg:hidden">
          <div className="flex h-[72px] items-center justify-between px-5 sm:px-8">
            <span className="font-heading text-2xl font-medium">
              {SITE.brand}
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={tHeader('aria.closeMenu')}
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
              {navItems.map((item) => (
                <li key={item.key} className="py-1">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAccordion(
                            openAccordion === item.key ? null : item.key,
                          )
                        }
                        className="flex w-full items-center justify-between py-3 text-start font-heading text-3xl font-light"
                      >
                        {item.label}
                        <Plus
                          className={`h-5 w-5 transition-transform ${
                            openAccordion === item.key ? 'rotate-45' : ''
                          }`}
                        />
                      </button>
                      {openAccordion === item.key && (
                        <ul className="pb-3 ps-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 text-base text-paper/70"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 font-heading text-3xl font-light"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between gap-4">
              <LanguageSwitcher tone="paper" />
            </div>
            <Link
              href={Route.Contact}
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-saffron px-6 py-4 text-base font-medium text-ink"
            >
              {tCommon('enquire')}
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
