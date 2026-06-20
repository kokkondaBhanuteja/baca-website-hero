---
kind: 'component'
name: 'AdminListTable'
file: 'app/(admin)/admin/components/admin-list-table/admin-list-table.tsx'
exports:
  - 'AdminListTable'
  - 'AdminListTableProps'
imports_from:
  - 'react'
  - 'lucide-react'
  - '@/lib/utils'
---

# AdminListTable

Purpose:
Generic, **controlled** admin list table. Renders a search input on top, a sticky table header, a responsive card list (`<md`) or table (`md+`), and a pagination strip — all driven by props. Owns no data, no search state, no page state. The caller wires those to URL params via `useAdminListUrlState`.

Used In:

- `ProductsTable` — `app/(admin)/admin/components/products-table/products-table.tsx`
- `CategoriesTable` — `app/(admin)/admin/components/categories-table/categories-table.tsx`
- `BlogArticlesTable` — `app/(admin)/admin/components/blog-articles-table/blog-articles-table.tsx`

Props:

- `items: T[]` — the already-paginated, already-filtered page of items. The caller fetched these from the server.
- `total: number` — total count of matching items across all pages (server-supplied).
- `page: number` — current 1-based page.
- `pageSize: number` — rows per page.
- `searchValue: string` — current search input value (controlled).
- `onSearchChange: (next: string) => void` — fires on every keystroke. The caller is responsible for debouncing + writing to the URL.
- `onPageChange: (next: number) => void` — fires when Prev / Next is clicked. The caller writes the new page to the URL.
- `searchPlaceholder: string` — input placeholder + accessible label.
- `header: ReactNode` — the `<tr>` rendered inside `<thead>`. Always visible.
- `renderRow: (item: T) => ReactNode` — each `<tr>` for the desktop table. Caller must include `key`.
- `renderCard?: (item: T) => ReactNode` — each card for the mobile (`<md`) layout. When supplied, the table is `hidden md:block` and a card list takes over below `md`.
- `columnCount: number` — used as `colSpan` on the empty-state row.
- `emptyMessage: string` — shown when `items` is empty AND there's no active search.
- `emptyFilteredMessage?: string` — shown instead when an active search returned no rows.
- `minWidth?: number` — table `min-width`, defaults to **640**.
- `isPending?: boolean` — when true, the whole table dims to ~60% opacity (visual feedback while a route transition is in flight). Wired up by `useAdminListUrlState`'s `useTransition`.

Business Logic:

- **Stateless** with respect to data. Derives `totalPages = max(1, ceil(total / pageSize))`, clamps `page` into `[1, totalPages]` for display, computes `showingFrom`/`showingTo` for the "Showing X–Y of Z" line.
- Prev/Next call `onPageChange(clampedPage ± 1)`; the button is `disabled` at the bounds.
- Empty body: when `items.length === 0`, renders a single full-width row with `noResultsMessage` (uses `emptyFilteredMessage` if the search is non-empty, else `emptyMessage`). `<thead>` is still rendered. The mobile card layout shows the same message in a centred bordered block.
- Responsive layout:
  - Desktop (`md+`): bordered table.
  - Mobile (`<md`): when `renderCard` is supplied, table is hidden and the card stack renders. Without `renderCard`, the table stays at all sizes (horizontal scroll fallback).
- Pagination strip is always rendered. Prev/Next disable at the bounds.

Dependencies:

- react: ReactNode
- lucide-react: Search, ChevronLeft, ChevronRight
- @/lib/utils: cn()

Accessibility:

- Search `<input type="search">` carries `aria-label` (mirrors the placeholder).
- Prev/Next buttons have `aria-label` and disable at extremes.
- `Page X of Y` uses `aria-live="polite"`.
- Search and chevron icons are `aria-hidden`.
- Logical-property classes (`start-3`, `ps-10`, `rtl:rotate-180`) keep RTL working.

Notes:

- Pair with `useAdminListUrlState` (same folder) to wire `searchValue` / `onSearchChange` / `onPageChange` / `isPending` to the URL. The hook handles debouncing and `useTransition` for smooth navigations.
- Each list page's Server Component is the source of truth: it reads `searchParams.{q, page}`, calls the service, and passes the returned page slice + total into this component via a thin per-page wrapper.
