---
kind: 'loading'
name: 'ProductsLoading'
file: 'app/(site)/[locale]/products/loading.tsx'
exports:
  - 'ProductsLoading'
imports_from:
  - '@/components/layout/site-header'
  - '@/components/ui/skeleton'
---

# ProductsLoading

Route: `n/a`  
Kind: loading (Next.js route convention file)  
Rendering: Server  
Auth: n/a

Purpose:
Skeleton fallback UI while products page data is loading. Shows header, intro skeletons, and 2 category sections with 6 products each.

Data:

- _No external data sources_

Business Logic:

- Renders SiteHeader (forceSolid)
- Skeleton for eyebrow, heading, and intro text
- Loops 2 categories x 6 products
- Each product: skeleton for image (aspect-[4/3]), name, summary

Renders:

- SiteHeader (forceSolid)
- Skeleton components (from @/components/ui/skeleton)

Notes:
Uses Skeleton component for placeholder. Layout matches the final ProductsPage structure.
