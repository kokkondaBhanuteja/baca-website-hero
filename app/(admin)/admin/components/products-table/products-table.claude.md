---
kind: 'component'
name: 'ProductsTable'
file: 'app/(admin)/admin/components/products-table/products-table.tsx'
exports:
  - 'ProductsTable'
  - 'ProductsTableProps'
imports_from:
  - 'next/link'
  - '@/lib/shared/types/catalogue-dto'
  - '@/app/(admin)/admin/components/admin-list-table'
  - '@/app/(admin)/admin/components/delete-entity-button'
---

# ProductsTable

Purpose:
Thin client wrapper around `AdminListTable` for the products list. Holds the products-page-specific column rendering (header, table row, mobile card) and forwards URL-driven state from `useAdminListUrlState`.

Used In:

- `app/(admin)/admin/(dashboard)/products/page.tsx`

Props:

- `items: ProductAdminDto[]` — the **current page slice** of products (server-paginated).
- `total: number` — total matching count across all pages.
- `page: number` — current 1-based page.
- `pageSize: number` — items per page (currently fixed to `ADMIN_LIST_DEFAULT_PAGE_SIZE` at the page level).
- `search: string` — current `?q=` value.

Business Logic:

- `useAdminListUrlState({ initialSearch: search })` handles debounced URL writes for search + immediate page navigation.
- `AdminListTable<ProductAdminDto>` is rendered with:
  - `columnCount = 5` (Name / Slug / Category / Status / Actions).
  - `minWidth = 640`.
  - `searchPlaceholder = "Search products by name, slug or category…"` (the server-side service matches across the same three fields).
  - 5-column `<thead>` row; actions column right-aligned.
  - Desktop `renderRow`: name (EN), slug (mono), category name (EN), status with conditional colour, Edit link + DeleteEntityButton.
  - Mobile `renderCard`: stacked layout — title + slug on the left, status badge on the right, Category label-value below, Edit/Delete actions in a bordered footer.
  - Empty-state messaging distinguishes "no products at all" from "no products match this search".

Dependencies:

- next/link
- @/lib/shared/types/catalogue-dto: ProductAdminDto
- @/app/(admin)/admin/components/admin-list-table: AdminListTable, useAdminListUrlState
- @/app/(admin)/admin/components/delete-entity-button: DeleteEntityButton

i18n:
None — admin is English-only.

Notes:

- Wrapper exists because `renderRow` / `renderCard` are closures and can't cross the server→client boundary; the page Server Component fetches the paginated slice and hands the data + meta to this component.
- Server-side search matches on `slug` (case-insensitive) + JSON `name.en` (case-sensitive `string_contains`) + joined `category.name.en`. Case-sensitive JSON path matching is a known limitation worth lifting via raw SQL or FTS if it bites.
