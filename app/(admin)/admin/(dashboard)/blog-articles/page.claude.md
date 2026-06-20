---
kind: 'page'
name: 'BlogArticlesListPage'
file: 'app/(admin)/admin/(dashboard)/blog-articles/page.tsx'
exports:
  - 'dynamic'
  - 'BlogArticlesListPage'
  - 'default'
imports_from:
  - '@/lib/server/services/blog-article-service'
  - '@/lib/shared/types/paginated-list'
  - '@/app/(admin)/admin/components/blog-articles-table'
route: '/admin/blog-articles'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# BlogArticlesListPage

Route: `/admin/blog-articles`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Admin list of all blog articles. Displays table with title (EN), slug, category, publish status (PUBLISHED/DRAFT), featured badge, and edit/delete actions.

Data:

- `listArticlesForAdmin({ page, pageSize, search })` — server-paginated. Returns `PaginatedList<BlogArticleAdminDto>`.
- searchParams: `{ page?: string; q?: string }`.

Business Logic:

- `export const dynamic = 'force-dynamic'`.
- Parses `?page` and `?q` from the URL and forwards to the service.
- Hands `{ items, total, page, pageSize, search }` to `<BlogArticlesTable />`. The wrapper uses `useAdminListUrlState` to write search/page back to the URL.

Renders:

- Page header: `<h1>Blog articles</h1>` + "New article" CTA, responsive.
- `<BlogArticlesTable items total page pageSize search />` — search + 10-per-page table (cards on mobile).

Notes:
Category enum is normalised (e.g. `INDUSTRY_INSIGHTS` → `industry insights`) for display. Server-side search currently matches title/slug only (category enum search not yet wired). Featured badge sits inline next to the title.
