'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import type { NavItem } from '@/components/layout/site-header/nav-types'

/**
 * Desktop nav row — top-level Links (for items without children) and split
 * label+disclosure pairs (for items with children: the label is a navigable
 * `Link` to the parent page, the chevron next to it is a small disclosure
 * `<button>` that opens the submenu). Hidden below `lg`; the mobile menu
 * takes over there.
 *
 * Accessibility:
 *   - Parent label is a real `<Link>` — Enter/click navigates to the parent
 *     page (e.g. "Products" → /products), Cmd-click opens in a new tab.
 *   - Chevron uses aria-haspopup="menu" + aria-expanded + aria-controls.
 *   - Mouse opens the submenu on hover of the wrapper; touch/keyboard users
 *     activate the chevron explicitly.
 *   - Escape closes and returns focus to the chevron trigger.
 *   - Click outside closes.
 *   - Only one submenu open at a time.
 */
export function SiteHeaderDesktopNav({
  navItems,
  onDark = false,
}: {
  navItems: NavItem[]
  /** Light foreground for the forest-green (scrolled-over-hero) bar. */
  onDark?: boolean
}) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const reactId = useId()
  const tHeader = useTranslations('header')

  const close = useCallback(() => setOpenKey(null), [])

  // Foreground colors flip to light on the forest-green scrolled bar; the hover
  // dropdown panel below stays a paper card (dark text) on any bar.
  const linkColor = onDark
    ? 'text-paper/80 hover:text-paper'
    : 'text-[#2E0F13]/80 hover:text-[#2E0F13]'
  const chevronColor = onDark
    ? 'text-paper/70 hover:text-paper'
    : 'text-[#2E0F13]/60 hover:text-[#2E0F13]'

  // Click outside closes the open submenu.
  useEffect(() => {
    if (!openKey) return
    const onPointer = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [openKey, close])

  // Esc closes the open submenu and returns focus to its trigger.
  useEffect(() => {
    if (!openKey) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        const trigger = triggerRefs.current[openKey]
        close()
        trigger?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [openKey, close])

  const onTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    key: string,
  ) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault()
        setOpenKey(key)
        break
    }
  }

  return (
    <nav
      ref={navRef}
      className="hidden items-center gap-1 lg:flex"
      aria-label={tHeader('aria.primaryNav')}
    >
      {navItems.map((item) => {
        const panelId = `${reactId}-panel-${item.key}`
        const isOpen = openKey === item.key

        if (!item.children) {
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-colors ${linkColor}`}
            >
              {item.label}
            </Link>
          )
        }

        return (
          <div
            key={item.key}
            className="relative flex items-center"
            onMouseEnter={() => setOpenKey(item.key)}
            onMouseLeave={close}
          >
            {/* Parent label — real `<Link>` so clicking navigates to /products,
                /blogs, /profile etc., AND so Cmd-click opens in a new tab. */}
            <Link
              href={item.href}
              className={`rounded-full py-2 ps-3 pe-1 text-sm transition-colors ${linkColor}`}
            >
              {item.label}
            </Link>
            {/* Chevron disclosure — opens the submenu (mouse hover already
                opens via the wrapper; this exists for touch + keyboard). */}
            <button
              ref={(element) => {
                triggerRefs.current[item.key] = element
              }}
              type="button"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-label={tHeader('aria.submenu', { label: item.label })}
              onClick={() => setOpenKey(isOpen ? null : item.key)}
              onKeyDown={(event) => onTriggerKeyDown(event, item.key)}
              className={`inline-flex h-7 w-6 items-center justify-center rounded-full transition-colors ${chevronColor}`}
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              role="menu"
              aria-label={item.label}
              className={`absolute start-0 top-full min-w-60 pt-2 transition-all duration-200 ${
                isOpen
                  ? 'visible translate-y-0 opacity-100'
                  : 'invisible translate-y-1 opacity-0'
              }`}
            >
              <ul className="overflow-hidden rounded-2xl border border-line bg-paper p-2 shadow-[0_18px_50px_-20px_rgba(20,24,26,0.35)]">
                {item.children.map((child) => (
                  <li key={child.href} role="none">
                    <Link
                      href={child.href}
                      role="menuitem"
                      tabIndex={isOpen ? 0 : -1}
                      onClick={close}
                      className="block rounded-xl px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-bone hover:text-ink"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </nav>
  )
}
