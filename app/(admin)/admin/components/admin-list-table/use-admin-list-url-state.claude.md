---
kind: 'hook'
name: 'useAdminListUrlState'
file: 'app/(admin)/admin/components/admin-list-table/use-admin-list-url-state.ts'
exports:
  - 'useAdminListUrlState'
  - 'AdminListUrlState'
imports_from:
  - 'react'
  - 'next/navigation'
---

# useAdminListUrlState

Purpose:
Bridge between the controlled `AdminListTable` and the URL-driven page/search state used by every admin list page. Returns the props that `AdminListTable` expects (`searchValue` / `onSearchChange` / `onPageChange` / `isPending`); internally it owns the debounced URL writes via `useTransition`.

Used In:

- `ProductsTable` / `CategoriesTable` / `BlogArticlesTable` (each per-page wrapper)

Args:

- `initialSearch: string` — current `?q=` value, supplied by the page Server Component (so SSR and client agree on the first render).
- `debounceMs?: number` — keystroke debounce before the URL write. Defaults to **300ms**.

Returns (`AdminListUrlState`):

- `searchValue: string` — local input mirror, updated synchronously on every keystroke for instant input feedback.
- `onSearchChange(next)` — setter for `searchValue`.
- `onPageChange(next)` — pushes `?page=` (or removes it if `next ≤ 1`).
- `isPending: boolean` — true while a `startTransition` navigation is in flight.

Business Logic:

- **External-URL sync**: when `initialSearch` changes (back/forward navigation, direct link), the local `searchValue` is reset to it.
- **Debounced search push**: after `debounceMs` of input idle, if `searchValue.trim() !== initialSearch`, writes `?q=` (or deletes it when empty) AND removes `?page=` so search results always start at page 1. Wrapped in `startTransition` so the UI doesn't flash the loading fallback.
- **Page push** is immediate (no debounce). `?page=1` is dropped from the URL for cleanliness.
- All navigations use `router.replace(..., { scroll: false })` — search and pagination updates don't add history entries and don't scroll the page to top.

Dependencies:

- react: useEffect, useState, useTransition
- next/navigation: usePathname, useRouter, useSearchParams

Notes:

- Lives alongside `AdminListTable` because the two are designed to be used together. Re-export is via the folder's `index.ts`.
- `useTransition` is what gives the smooth "table dims while new data loads" effect — `AdminListTable` reads `isPending` and applies a `transition-opacity` class.
