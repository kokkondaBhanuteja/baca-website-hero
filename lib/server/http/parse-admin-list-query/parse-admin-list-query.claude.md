---
kind: 'http'
name: 'ParseAdminListQuery'
file: 'lib/server/http/parse-admin-list-query/parse-admin-list-query.ts'
exports:
  - 'parseAdminListQuery'
imports_from:
  - '@/lib/shared/types/paginated-list'
called_by:
  - 'app/api/products/route.ts'
  - 'app/api/categories/route.ts'
  - 'app/api/blog-articles/route.ts'
auth: 'n/a (helper)'
side_effects: 'Pure parsing of request URL params.'
---

# ParseAdminListQuery

Purpose:
Standard parser for the `?page=&pageSize=&q=` query string used by every paginated admin list endpoint. Returns a fully-defaulted `Required<AdminListQuery>` so service callers never deal with `undefined`.

Exports:

- `parseAdminListQuery(request: Request): Required<AdminListQuery>` — returns `{ page, pageSize, search }`.

Business Logic:

- `page` — positive integer, defaults to **1**. Non-numeric/zero/negative values fall back to 1.
- `pageSize` — positive integer, defaults to `ADMIN_LIST_DEFAULT_PAGE_SIZE` (10), capped at **100** to prevent abuse.
- `search` — raw `q` param value, defaults to `''` (empty string).

Called by:

- `app/api/products/route.ts`
- `app/api/categories/route.ts`
- `app/api/blog-articles/route.ts`

Notes:

- Server-only (uses `import 'server-only'`).
- Doesn't validate that `page * pageSize` is within bounds of the dataset — services trim with `skip/take`, and the controlled `AdminListTable` clamps page based on total returned.
