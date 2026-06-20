'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FileText,
  Images,
  Layers,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  type LucideIcon,
} from 'lucide-react'

import { authApi } from '@/lib/api-client/endpoints/auth-api'
import type { AdminUserDto } from '@/lib/shared/types/admin-user-dto'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Blog articles', href: '/admin/blog-articles', icon: FileText },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
]

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'baca:admin:sidebar:collapsed'

function lgMediaQuery(): MediaQueryList {
  return window.matchMedia('(min-width: 1024px)')
}

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminUserDto
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [hasReadStoredCollapse, setHasReadStoredCollapse] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)

  // Hydrate the collapse preference from localStorage on the first client
  // render. setState-during-render produces a single follow-up render whose
  // first pass still matches SSR (both render `false`), avoiding hydration
  // mismatch — and satisfies react-hooks/set-state-in-effect.
  if (!hasReadStoredCollapse && typeof window !== 'undefined') {
    setHasReadStoredCollapse(true)
    if (window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true') {
      setIsDesktopCollapsed(true)
    }
  }

  useEffect(() => {
    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      String(isDesktopCollapsed),
    )
  }, [isDesktopCollapsed])

  // Close the mobile drawer on route change. setState-during-render is
  // preferred over useEffect+setState for resetting state in response to a
  // changed input (next-intl / Next router pathname here).
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsMobileNavOpen(false)
  }

  useEffect(() => {
    if (!isMobileNavOpen) return
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMobileNavOpen(false)
    }
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    }
  }, [isMobileNavOpen])

  async function handleLogout() {
    await authApi.logout()
    router.replace('/admin/login')
    router.refresh()
  }

  function isItemActive(href: string) {
    return pathname.startsWith(href)
  }

  function handleSidebarToggle() {
    if (lgMediaQuery().matches) {
      setIsDesktopCollapsed((current) => !current)
    } else {
      setIsMobileNavOpen(false)
    }
  }

  const activeLabel =
    NAV_ITEMS.find((item) => isItemActive(item.href))?.label ?? 'Admin'

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile top bar — never shows on lg+ (the rail is always visible there) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open admin navigation"
          aria-expanded={isMobileNavOpen}
          aria-controls="admin-sidebar"
          className="-ms-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors hover:bg-bone"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-lg font-medium text-ink">
            BACA
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-60">
            {activeLabel}
          </span>
        </div>
        <span className="inline-flex h-10 w-10" aria-hidden />
      </header>

      {/* Mobile backdrop */}
      {isMobileNavOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
        />
      )}

      <aside
        id="admin-sidebar"
        aria-label="Admin sidebar"
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex w-64 max-w-[85vw] shrink-0 flex-col border-e border-line bg-paper transition-transform duration-200',
          'lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:max-w-none lg:translate-x-0 lg:transition-[width] lg:duration-200',
          isMobileNavOpen
            ? 'translate-x-0'
            : '-translate-x-full rtl:translate-x-full',
          isDesktopCollapsed ? 'lg:w-16' : 'lg:w-60',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b border-line px-5 py-4 lg:px-4 lg:py-5',
            isDesktopCollapsed && 'lg:justify-center lg:px-2',
          )}
        >
          <div
            className={cn(
              'flex items-baseline gap-2',
              isDesktopCollapsed && 'lg:hidden',
            )}
          >
            <span className="font-heading text-xl font-medium text-ink">
              BACA
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-60">
              Admin
            </span>
          </div>
          <button
            type="button"
            onClick={handleSidebarToggle}
            aria-label={
              isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
            title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="-me-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-60 transition-colors hover:bg-bone hover:text-ink lg:-me-0"
          >
            <X className="h-5 w-5 lg:hidden" aria-hidden />
            {isDesktopCollapsed ? (
              <PanelLeftOpen
                className="hidden h-5 w-5 rtl:rotate-180 lg:block"
                aria-hidden
              />
            ) : (
              <PanelLeftClose
                className="hidden h-5 w-5 rtl:rotate-180 lg:block"
                aria-hidden
              />
            )}
          </button>
        </div>
        <nav
          aria-label="Admin sections"
          className={cn(
            'flex-1 space-y-1 overflow-y-auto p-3',
            isDesktopCollapsed && 'lg:px-2',
          )}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                title={isDesktopCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isDesktopCollapsed && 'lg:justify-center lg:px-0 lg:py-2.5',
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-ink/75 hover:bg-bone hover:text-ink',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className={cn(isDesktopCollapsed && 'lg:hidden')}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
        <div
          className={cn(
            'border-t border-line p-3',
            isDesktopCollapsed && 'lg:px-2',
          )}
        >
          <p
            className={cn(
              'truncate px-3 pb-2 text-xs text-ink-60',
              isDesktopCollapsed && 'lg:hidden',
            )}
          >
            {admin.email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            title={isDesktopCollapsed ? 'Sign out' : undefined}
            aria-label="Sign out"
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-bone hover:text-clay',
              isDesktopCollapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            <span className={cn(isDesktopCollapsed && 'lg:hidden')}>
              Sign out
            </span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  )
}
