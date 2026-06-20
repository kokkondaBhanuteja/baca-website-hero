---
kind: 'page'
name: 'NewProductPage'
file: 'app/(admin)/admin/(dashboard)/products/new/page.tsx'
exports:
  - 'dynamic'
  - 'NewProductPage'
  - 'default'
imports_from:
  - '@/lib/server/services/category-service'
route: '/admin/products/new'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# NewProductPage

Route: `/admin/products/new`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Create new product form. Fetches category list and passes dropdown options to ProductForm client component.

Data:

- listCategoriesForAdmin() — all categories with name.en for dropdown labels

Business Logic:

- export const dynamic = 'force-dynamic'
- Maps categories to options { id, label: name.en }
- Passes categories as prop to ProductForm (no initial data)

Renders:

- Heading 'New product'
- ProductForm component (client)

Notes:
ProductForm is a client component at @/components/admin/product-form that handles form state and submission.
