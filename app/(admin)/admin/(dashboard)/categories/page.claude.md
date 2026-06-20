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

- listCategoriesForAdmin() — all categories with name (LocalizedString), slug, productCount, isPublished

Business Logic:

- export const dynamic = 'force-dynamic'
- Table: name.en, slug, productCount, isPublished, edit/delete actions

Renders:

- Heading 'Categories', New category button
- Table or empty message

Notes:
Shows only EN name for brevity.
