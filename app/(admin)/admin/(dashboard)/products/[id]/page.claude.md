---
kind: 'page'
name: 'EditProductPage'
file: 'app/(admin)/admin/(dashboard)/products/[id]/page.tsx'
exports:
  - 'dynamic'
  - 'EditProductPage'
  - 'default'
imports_from:
  - '@/lib/server/http/http-error'
  - '@/lib/server/services/category-service'
  - '@/lib/server/services/product-service'
route: '/admin/products/[id]'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# EditProductPage

Route: `/admin/products/[id]`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Edit existing product. Fetches product (all locales) and category list. Passes product as initial data to ProductForm. notFound() if product not found.

Data:

- getProductForAdmin(id) — single product with all localized fields
- listCategoriesForAdmin() — all categories for dropdown

Business Logic:

- export const dynamic = 'force-dynamic'
- Awaits product; catches HttpError 404 → notFound()
- Promise.all() fetches product and categories
- Maps categories to dropdown options
- Passes product as initial prop to ProductForm

Renders:

- Heading 'Edit product'
- ProductForm with initial={product}

Notes:
Server component that fetches and passes initial data. ProductForm client component handles updates via PATCH /api/products/{id}.
