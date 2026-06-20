'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SCROLL_HEADER_THRESHOLD_PX } from '@/constants/animations'
import { NAV } from '@/constants/sections/nav'
import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

import { SiteHeaderDesktopNav } from '@/components/layout/site-header/desktop-nav'
import { SiteHeaderMobileMenu } from '@/components/layout/site-header/mobile-menu'
import type {
  NavItem,
  NavLink,
} from '@/components/layout/site-header/nav-types'

export type { NavLink }

/**
 * Site-wide header orchestrator. Owns:
 *   - scroll state (transparent over hero → solid below the threshold)
 *   - the mobile overlay's open/closed state + body-scroll lock
 *   - nav item derivation (Products / Insights become dropdowns populated by
 *     top-3 live items + a "view all" entry; About / Contact are plain links)
 *
 * Desktop nav rendering and mobile overlay rendering live in sibling files.
 */
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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null)

  // Inner pages sit on a light background, so the header must show its solid
  // (dark-on-paper) treatment immediately rather than the over-hero transparent one.
  const scrolled = forceSolid || isScrolled

  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const tBlogs = useTranslations('blogsPage')

  useEffect(() => {
    const onScroll = () =>
      setIsScrolled(window.scrollY > SCROLL_HEADER_THRESHOLD_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMobileOpen) return
    // Save whatever the page had set on body.overflow so we can restore exactly
    // that on cleanup, instead of clobbering it to ''.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileOpen])

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
        <div className="mx-auto flex h-header-base max-w-content items-center justify-between gap-6 px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          {/* Wordmark */}
          <Link
            href={Route.Home}
            className="group inline-flex items-baseline lg:justify-self-start"
            aria-label={tHeader('aria.home')}
          >
            <span
              className={`font-heading text-3xl font-medium tracking-tight transition-colors sm:text-2xl ${
                scrolled ? 'text-ink' : 'text-paper'
              }`}
            >
              {SITE.brand}
            </span>
          </Link>

          <SiteHeaderDesktopNav navItems={navItems} scrolled={scrolled} />

          {/* Right actions */}
          <div className="flex items-center gap-3 lg:justify-self-end">
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
              ref={mobileTriggerRef}
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label={tHeader('aria.openMenu')}
              aria-haspopup="dialog"
              aria-expanded={isMobileOpen}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors lg:hidden ${
                scrolled ? 'border-line text-ink' : 'border-paper/40 text-paper'
              }`}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <SiteHeaderMobileMenu
        navItems={navItems}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        triggerRef={mobileTriggerRef}
      />
    </>
  )
}
