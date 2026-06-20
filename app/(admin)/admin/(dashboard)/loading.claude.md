---
kind: 'loading'
name: 'AdminDashboardLoading'
file: 'app/(admin)/admin/(dashboard)/loading.tsx'
exports:
  - 'AdminDashboardLoading'
imports_from:
  - '@/app/(admin)/admin/components/admin-list-skeleton'
route: '(dashboard)'
auth: 'n/a (inside the (dashboard) auth-gated group)'
---

# AdminDashboardLoading

Route: `(dashboard)` segment boundary (fires for any nested route without its own loading.tsx)  
Kind: loading (Next.js route convention file)  
Rendering: Server  
Auth: n/a (inside the (dashboard) auth-gated group)

Purpose:
Single shared loading boundary for every admin dashboard route — products,
categories, blog-articles, enquiries, gallery, and the dashboard root. Replaces
what used to be 5 near-identical loading.tsx files.

Data:

- _No external data sources — pure placeholder._

Business Logic:

- Renders `<AdminListSkeleton />` from `app/(admin)/admin/components/admin-list-skeleton`.
- Next.js shows this fallback while any child segment's Server Component awaits.

Renders:

- `AdminListSkeleton` (heading placeholder + optional CTA placeholder + 6 table-row placeholders)

Notes:
Per-page loading.tsx files were intentionally consolidated — they all shared the
same table-row skeleton shape. If a page ever needs a fundamentally different
placeholder (e.g., the dashboard root's count-card grid), add a local loading.tsx
under that segment to override this one. The current generic skeleton is good
enough for every admin page because admin transitions are <300 ms in practice.
