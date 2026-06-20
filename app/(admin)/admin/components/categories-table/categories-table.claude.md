---
kind: 'component'
name: 'CategoriesTable'
file: 'app/(admin)/admin/components/categories-table/categories-table.tsx'
exports:
  - 'CategoriesTable'
  - 'CategoriesTableProps'
imports_from:
  - 'next/link'
  - '@/lib/shared/types/catalogue-dto'
  - '@/app/(admin)/admin/components/admin-list-table'
  - '@/app/(admin)/admin/components/delete-entity-button'
---

# CategoriesTable

Purpose:
Thin client wrapper around `AdminListTable` for the categories list. Holds the categories-page-specific rendering and forwards URL-driven state from `useAdminListUrlState`.

Used In:

- `app/(admin)/admin/(dashboard)/categories/page.tsx`

Props:

- `items: (ProductCategoryAdminDto & { productCount: number })[]` — current page slice (server-paginated).
- `total`, `page`, `pageSize`, `search` — server-supplied pagination + search state.

Business Logic:

- `useAdminListUrlState({ initialSearch: search })` for debounced URL writes.
- `AdminListTable<CategoryRow>` with `columnCount = 5`, `minWidth = 640`, placeholder "Search categories by name or slug…".
- 5-column header (Name / Slug / Products / Status / Actions); actions right-aligned.
- Desktop `renderRow`: name (EN), slug (mono), productCount, status with conditional colour, Edit + DeleteEntityButton.
- Mobile `renderCard`: title + slug + status badge on the top row; "Products" label-value below; Edit/Delete actions in a bordered footer.
- Server-side search matches `slug` (insensitive) + JSON `name.en` (`string_contains`).

Dependencies:

- next/link
- @/lib/shared/types/catalogue-dto: ProductCategoryAdminDto
- @/app/(admin)/admin/components/admin-list-table: AdminListTable, useAdminListUrlState
- @/app/(admin)/admin/components/delete-entity-button: DeleteEntityButton

i18n:
None — admin is English-only.

Notes:
A local `CategoryRow` type intersects `ProductCategoryAdminDto` with `productCount: number` to match `listCategoriesForAdmin()`'s row shape.
