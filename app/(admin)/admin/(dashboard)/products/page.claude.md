---
kind: 'page'
name: 'ProductsListPage'
file: 'app/(admin)/admin/(dashboard)/products/page.tsx'
exports:
  - 'dynamic'
  - 'ProductsListPage'
  - 'default'
imports_from:
  - '@/lib/server/services/product-service'
route: '/admin/products'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# ProductsListPage

Route: `/admin/products`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Admin list of all products. Displays table with name (EN), slug, category, publish status, and edit/delete actions. New product button links to /admin/products/new.

Data:

- listProductsForAdmin() — all products (all locales) with name (LocalizedString), slug, categoryName, isPublished

Business Logic:

- export const dynamic = 'force-dynamic'
- Renders empty message if no products
- Table: name.en, slug, categoryName.en, isPublished (Published/Draft), edit/delete actions
- Edit link to /admin/products/{id}
- DeleteEntityButton for delete action

Renders:

- Heading 'Products', New product button
- Table or empty message

Notes:
Shows EN name only (not all locales) for brevity. force-dynamic to reflect edits immediately.
