---
kind: 'page'
name: 'CategoriesListPage'
file: 'app/(admin)/admin/(dashboard)/categories/page.tsx'
exports:
  - 'dynamic'
  - 'CategoriesListPage'
  - 'default'
imports_from:
  - '@/lib/server/services/category-service'
  - '@/lib/shared/types/paginated-list'
  - '@/app/(admin)/admin/components/categories-table'
route: '/admin/categories'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# CategoriesListPage

Route: `/admin/categories`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Admin list of all categories. Displays table with name (EN), slug, product count, publish status, and edit/delete actions.

Data:

- `listCategoriesForAdmin({ page, pageSize, search })` — server-paginated. Returns `PaginatedList<ProductCategoryAdminDto>`.
- searchParams: `{ page?: string; q?: string }`.

Business Logic:

- `export const dynamic = 'force-dynamic'`.
- Parses `?page` and `?q` from the URL and forwards to the service.
- Hands `{ items, total, page, pageSize, search }` to `<CategoriesTable />`. The wrapper uses `useAdminListUrlState` to write search/page back to the URL.

Renders:

- Page header: `<h1>Categories</h1>` + "New category" CTA, responsive.
- `<CategoriesTable items total page pageSize search />` — search + 10-per-page table (cards on mobile).

Notes:
Shows only EN name for brevity. Search matches on slug (insensitive) + JSON `name.en` server-side.
