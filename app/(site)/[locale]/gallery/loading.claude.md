---
kind: 'loading'
name: 'GalleryLoading'
file: 'app/(site)/[locale]/gallery/loading.tsx'
exports:
  - 'GalleryLoading'
imports_from:
  - '@/components/layout/site-header'
  - '@/components/ui/skeleton'
---

# GalleryLoading

Route: `n/a`  
Kind: loading (Next.js route convention file)  
Rendering: Server  
Auth: n/a

Purpose:
Skeleton fallback for gallery. Shows 12 square image placeholders in responsive grid.

Data:

- _No external data sources_

Business Logic:

- Skeleton for heading
- 12 aspect-square skeleton placeholders

Renders:

- SiteHeader (forceSolid)
- Skeleton components

Notes:
Matches gallery grid layout.
