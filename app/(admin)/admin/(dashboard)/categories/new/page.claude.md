---
kind: 'page'
name: 'NewCategoryPage'
file: 'app/(admin)/admin/(dashboard)/categories/new/page.tsx'
exports:
  - 'NewCategoryPage'
imports_from: []
route: '/admin/categories/new'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# NewCategoryPage

Route: `/admin/categories/new`  
Kind: page (Next.js route convention file)  
Rendering: Server  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Create new category form. Renders CategoryForm client component with no initial data.

Data:

- _No external data sources_

Business Logic:

- Renders CategoryForm with no initial prop

Renders:

- Heading 'New category'
- CategoryForm component

Notes:
CategoryForm client component handles form state and POSTs to /api/categories.
