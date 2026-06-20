---
kind: 'page'
name: 'EditCategoryPage'
file: 'app/(admin)/admin/(dashboard)/categories/[id]/page.tsx'
exports:
  - 'dynamic'
  - 'EditCategoryPage'
  - 'default'
imports_from:
  - '@/lib/server/services/category-service'
  - '@/lib/server/http/http-error'
route: '/admin/categories/[id]'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# EditCategoryPage

Route: `/admin/categories/[id]`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Edit existing category. Fetches category (all locales), passes as initial data to CategoryForm. notFound() if not found.

Data:

- getCategoryForAdmin(id) — single category with all localized fields

Business Logic:

- export const dynamic = 'force-dynamic'
- Catches HttpError 404 → notFound()
- Passes category as initial prop to CategoryForm

Renders:

- Heading 'Edit category'
- CategoryForm with initial={category}

Notes:
Server component fetches; client component (CategoryForm) handles updates via PATCH /api/categories/{id}.
