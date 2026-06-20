'use client'

import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import { Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Route } from '@/constants/routes'
import { SITE } from '@/constants/site'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

import type { NavItem } from '@/components/layout/site-header/nav-types'

/**
 * Full-screen overlay menu shown below the `lg` breakpoint.
 *
 * Accessibility:
 *   - role="dialog" aria-modal="true" with aria-labelledby pointing at the brand title.
 *   - On open: focus moves to the close button.
 *   - Escape closes the dialog.
 *   - Tab cycles inside the dialog (focus trap).
 *   - On close: focus returns to the hamburger trigger (`triggerRef`).
 *   - Rendered OUTSIDE the header so the scrolled-state backdrop-filter cannot trap
 *     this fixed overlay.
 */
export function SiteHeaderMobileMenu({
  navItems,
  isOpen,
  onClose,
  triggerRef,
}: {
  navItems: NavItem[]
  isOpen: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}) {
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const reactId = useId()
  const titleId = `${reactId}-title`

  // Move focus to the close button on OPEN, return to the trigger only on the
  // OPEN→CLOSED transition. Without the transition guard, the `else` branch
  // would fire on initial mount (isOpen=false from the start) and yank focus
  // to the hamburger trigger every page load — scrolling to top on mobile and
  // surprising keyboard users.
  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (isOpen) {
      // Defer to let the dialog mount.
      const id = requestAnimationFrame(() => closeButtonRef.current?.focus())
      wasOpenRef.current = true
      return () => cancelAnimationFrame(id)
    }
    if (wasOpenRef.current) {
      triggerRef.current?.focus()
      wasOpenRef.current = false
    }
  }, [isOpen, triggerRef])

  // Esc closes; Tab/Shift+Tab traps focus inside the dialog.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper lg:hidden"
    >
      <div className="flex h-header-base items-center justify-between px-5 sm:px-8">
        <span id={titleId} className="font-heading text-2xl font-medium">
          {SITE.brand}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={tHeader('aria.closeMenu')}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-paper"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav
        className="flex-1 overflow-y-auto px-5 pb-10 pt-4 sm:px-8"
        aria-label={tHeader('aria.mobileNav')}
      >
        <ul className="divide-y divide-paper/10">
          {navItems.map((item) => (
            <li key={item.key} className="py-1">
              {item.children ? (
                <>
                  <button
                    type="button"
                    aria-expanded={openAccordion === item.key}
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
                      aria-hidden
                    />
                  </button>
                  {openAccordion === item.key && (
                    <ul className="pb-3 ps-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
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
                  onClick={onClose}
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
          onClick={onClose}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-saffron px-6 py-4 text-base font-medium text-ink"
        >
          {tCommon('enquire')}
        </Link>
      </nav>
    </div>
  )
}
