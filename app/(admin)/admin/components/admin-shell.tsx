'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { authApi } from '@/lib/api-client/endpoints/auth-api'
import type { AdminUserDto } from '@/lib/shared/types/admin-user-dto'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Blog articles', href: '/admin/blog-articles' },
  { label: 'Gallery', href: '/admin/gallery' },
  { label: 'Enquiries', href: '/admin/enquiries' },
]

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminUserDto
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await authApi.logout()
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-paper">
        <div className="border-b border-line px-6 py-5">
          <span className="font-heading text-xl font-medium text-ink">
            BACA
          </span>
          <span className="ms-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-60">
            Admin
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-ink/75 hover:bg-bone hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-line p-3">
          <p className="px-3 pb-2 text-xs text-ink-60">{admin.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-bone hover:text-clay"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  )
}
