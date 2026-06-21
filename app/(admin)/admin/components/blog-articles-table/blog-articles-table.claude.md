---
kind: 'component'
name: 'BlogArticlesTable'
file: 'app/(admin)/admin/components/blog-articles-table/blog-articles-table.tsx'
exports:
  - 'BlogArticlesTable'
  - 'BlogArticlesTableProps'
imports_from:
  - 'next/link'
  - '@/lib/shared/types/blog-dto'
  - '@/app/(admin)/admin/components/admin-list-table'
  - '@/app/(admin)/admin/components/delete-entity-button'
---

# BlogArticlesTable

Purpose:
Thin client wrapper around `AdminListTable` for the blog articles list. Holds the articles-page-specific rendering (with inline "Featured" saffron badge) and forwards URL-driven state from `useAdminListUrlState`.

Used In:

- `app/(admin)/admin/(dashboard)/blog-articles/page.tsx`

Props:

- `items: BlogArticleAdminDto[]` — current page slice (server-paginated).
- `total`, `page`, `pageSize`, `search` — server-supplied pagination + search state.

Business Logic:

- No `formatCategory` helper — the DTO now carries `blogTypeName` directly from the joined blog type.
- `useAdminListUrlState({ initialSearch: search })` for debounced URL writes.
- `AdminListTable<BlogArticleAdminDto>` with `columnCount = 5`, `minWidth = 720` (slightly wider so "Featured" badge fits next to title without wrapping), placeholder "Search articles by title or slug…".
- Desktop `renderRow`: title (EN) with optional Featured saffron pill, slug (mono), article.blogTypeName, status with conditional colour (PUBLISHED → forest), Edit + DeleteEntityButton.
- Mobile `renderCard`: title + Featured pill, slug, status; Category label-value (article.blogTypeName) below; Edit/Delete actions in a bordered footer.
- Server-side search matches `slug` (insensitive) + JSON `title.en` (`string_contains`).

Dependencies:

- next/link
- @/lib/shared/types/blog-dto: BlogArticleAdminDto
- @/app/(admin)/admin/components/admin-list-table: AdminListTable, useAdminListUrlState
- @/app/(admin)/admin/components/delete-entity-button: DeleteEntityButton

i18n:
None — admin is English-only.

Notes:
Featured badge uses inline `bg-saffron/15` per the existing visual treatment.
