---
kind: 'page'
name: 'ProductsListPage'
file: 'app/(admin)/admin/(dashboard)/products/page.tsx'
exports:
  - 'dynamic'
  - 'ProductsListPage'
  - 'default'
imports_from:
  - '@/lib/server/services/product-service'
  - '@/lib/shared/types/paginated-list'
  - '@/app/(admin)/admin/components/products-table'
route: '/admin/products'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# ProductsListPage

Route: `/admin/products`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Admin list of all products. Displays table with name (EN), slug, category, publish status, and edit/delete actions. New product button links to /admin/products/new.

Data:

- `listProductsForAdmin({ page, pageSize, search })` — server-paginated. Returns `PaginatedList<ProductAdminDto>` ({ items, total, page, pageSize }).
- searchParams: `{ page?: string; q?: string }` (URL-driven page + search state).

Business Logic:

- `export const dynamic = 'force-dynamic'` — every render reads fresh URL params and re-queries the DB.
- Parses `?page` (default 1) via `parsePage`; reads `?q=` (default `''`).
- Calls `listProductsForAdmin({ page, pageSize: ADMIN_LIST_DEFAULT_PAGE_SIZE, search: q })`.
- Hands the returned `{ items, total, page, pageSize }` plus the raw `q` into `<ProductsTable />`. That client wrapper uses `useAdminListUrlState` to write search/page changes back into the URL via `router.replace` + `useTransition`.

Renders:

- Page header: `<h1>Products</h1>` + "New product" CTA, responsive.
- `<ProductsTable items total page pageSize search />` — search input, paginated table (10/page), always-visible thead, pagination strip. Mobile: stacked card list instead of table.

Notes:
Shows EN name only (not all locales) for brevity. Search hits the server with `?q=` (debounced 300ms in the wrapper). Pagination is server-side: each Prev/Next click pushes `?page=` and the page re-renders with the new slice.
