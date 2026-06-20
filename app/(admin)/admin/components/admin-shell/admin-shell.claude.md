---
kind: 'component'
name: 'AdminShell'
file: 'app/(admin)/admin/components/admin-shell/admin-shell.tsx'
exports:
  - 'AdminShell'
imports_from:
  - 'lucide-react'
  - '@/lib/api-client/endpoints/auth-api'
  - '@/lib/shared/types/admin-user-dto'
  - '@/lib/utils'
---

# AdminShell

Purpose:
Admin dashboard chrome: fixed sidebar nav + main content area. Shows admin email + logout button.

Used In:

- Admin dashboard layout (app/(admin)/admin/(dashboard)/layout.tsx)

Props:

- admin: AdminUserDto — the logged-in admin user data
- children: React.ReactNode — page content

Business Logic:

- Flex layout: sidebar (w-60 shrink-0 border-r border-line bg-paper) + main (flex-1 overflow-y-auto px-8 py-8)
- Sidebar header: brand 'BACA' + 'Admin' label
- NAV_ITEMS hardcoded: Dashboard, Products, Categories, Blog articles, Gallery, Enquiries
- Active route detection: item.href === '/admin' for exact match, else startsWith check
- Active style: bg-ink text-paper; inactive: text-ink/75 hover:bg-bone
- Footer: admin.email display + logout button
- Logout calls authApi.logout() → router.replace('/admin/login') → router.refresh()

Dependencies:

- next/link, next/navigation: usePathname, useRouter
- lucide-react: LogOut
- @/lib/api-client/endpoints/auth-api: authApi
- @/lib/shared/types/admin-user-dto
- @/lib/utils: cn()

i18n:
None — English only, nav labels hardcoded

Accessibility:
Semantic nav structure. Links indicate active state via className, not aria-current (could be improved).

Notes:
This wraps all admin pages. The layout guard (checking for admin user) happens in the parent (dashboard) layout, not here. Sidebar is sticky; main content scrolls.
