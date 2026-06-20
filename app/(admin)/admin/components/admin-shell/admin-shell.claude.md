---
kind: 'component'
name: 'AdminShell'
file: 'app/(admin)/admin/components/admin-shell/admin-shell.tsx'
exports:
  - 'AdminShell'
imports_from:
  - 'react'
  - 'lucide-react'
  - '@/lib/api-client/endpoints/auth-api'
  - '@/lib/shared/types/admin-user-dto'
  - '@/lib/utils'
---

# AdminShell

Purpose:
Admin dashboard chrome with a responsive sidebar that can collapse into an icon-only **rail** on desktop. On smaller screens it becomes a slide-in drawer with a hamburger top bar.

Used In:

- Admin dashboard layout (`app/(admin)/admin/(dashboard)/layout.tsx`)

Props:

- admin: AdminUserDto — the logged-in admin user data
- children: React.ReactNode — page content

Business Logic:

- Outer layout: `flex flex-col lg:flex-row min-h-screen`. On mobile the header sits above main; on `lg+` the aside sits beside main and **always stays visible** (it just narrows when collapsed).
- **Two state machines, by viewport:**
  - `isMobileNavOpen` — slide-in drawer for `<lg`.
  - `isDesktopCollapsed` — persisted to `localStorage` under `baca:admin:sidebar:collapsed`. Toggles the lg+ sidebar between **full width (`lg:w-60`)** and an **icon rail (`lg:w-16`)**.
- **NAV_ITEMS** carry a `LucideIcon` per entry (Categories → Layers, Products → Package, Blog articles → FileText, Gallery → Images, Enquiries → Inbox). Categories sits above Products because a category must exist before a product can be assigned to one. There is **no Dashboard entry and no `/admin` root page** — login lands directly on `/admin/categories`. The icon is always rendered; the text label is hidden via `lg:hidden` while collapsed on lg+.
- **Sidebar width** transitions smoothly via `lg:transition-[width] lg:duration-200`. Width swap is `lg:w-60` ↔ `lg:w-16` based on `isDesktopCollapsed`.
- **Header layout** (top of sidebar):
  - Expanded (default): "BACA Admin" wordmark on the left, collapse button on the right. Container is `justify-between`.
  - Collapsed (lg+): wordmark hidden via `lg:hidden`, container becomes `lg:justify-center`, just the expand button shows. Icon swaps to `PanelLeftOpen` (RTL-mirrored). On mobile the same button renders as `X` (drawer close) via `lg:hidden`/`hidden lg:block` siblings.
- **Nav links**:
  - Expanded: icon + label, `px-3 py-2`.
  - Collapsed (lg+): `lg:justify-center lg:px-0 lg:py-2.5`, label hidden, `title={item.label}` for the native tooltip.
  - Active state: `bg-ink text-paper` + `aria-current="page"`. Works the same in both modes — the active pill just becomes icon-sized on the rail.
- **Footer** (admin email + Sign out): email line hidden when collapsed on lg+; the Sign out button collapses to a centred LogOut icon with `title="Sign out"`.
- **Toggle dispatch** (`handleSidebarToggle`): if `window.matchMedia('(min-width: 1024px)').matches`, flip `isDesktopCollapsed`. Otherwise close the mobile drawer.
- **Mobile top bar** (`lg:hidden`) is now only ever shown on `<lg` — the rail handles the lg+ case so there's no need to expose a desktop hamburger anywhere outside the sidebar.
- **Mobile backdrop button** (`bg-ink/40 fixed inset-0 z-40 lg:hidden`) covers the page when the drawer is open; clicking it closes the drawer.
- **Auto-close** on route change resets the mobile drawer only — desktop collapse persists across navigation by design.
- **ESC key** closes the mobile drawer; body scroll is locked while the drawer is open (desktop collapse doesn't lock scroll).
- Active route detection via `isItemActive(href)`: `pathname.startsWith(href)`. No special case for `/admin` since there's no nav entry for it.
- Logout calls `authApi.logout()` → `router.replace('/admin/login')` → `router.refresh()`.
- Main: `min-w-0 flex-1 overflow-x-hidden`, responsive paddings (`px-4 py-6 sm:px-6 sm:py-8 lg:px-8`). `min-w-0` prevents flex children from forcing horizontal overflow.

Dependencies:

- react: useEffect, useState
- next/link, next/navigation: usePathname, useRouter
- lucide-react: FileText, Images, Inbox, Layers, LogOut, Menu, Package, PanelLeftClose, PanelLeftOpen, X, LucideIcon (type)
- @/lib/api-client/endpoints/auth-api: authApi
- @/lib/shared/types/admin-user-dto
- @/lib/utils: cn()

i18n:
None — English only, nav labels hardcoded.

Accessibility:

- Mobile hamburger: `aria-label="Open admin navigation"`, `aria-expanded={isMobileNavOpen}`, `aria-controls="admin-sidebar"`.
- Sidebar toggle button: dynamic `aria-label` ("Collapse sidebar" ↔ "Expand sidebar" on lg+; "Close admin navigation" via the X icon on mobile) and matching `title`.
- Collapsed nav items: icon-only but every link still has `title={item.label}` for sighted hover discovery; the visible icon plus accessible name (text-content fallback for SRs, since the `<span>` is `lg:hidden` not `display:none` — SRs still read it) keeps screen-reader users covered.
- Active nav link uses `aria-current="page"`.
- ESC closes the mobile drawer; body scroll is locked only while the drawer is open.

Notes:

- Auth guard happens in the parent `(dashboard)` layout, not here.
- Desktop collapse state survives reloads (localStorage); mobile drawer state resets on every navigation.
- Drawer mirroring works in RTL via logical utilities (`start-0`, `end-2`, `ms-*`, `me-*`); the PanelLeftClose/PanelLeftOpen icons are `rtl:rotate-180` so the chevron always points "into" the rail direction.
- The "active section label" in the mobile top bar reflects the currently matched NAV_ITEMS entry (falls back to "Admin").
