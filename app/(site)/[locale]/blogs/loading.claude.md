---
kind: 'loading'
name: 'BlogsLoading'
file: 'app/(site)/[locale]/blogs/loading.tsx'
exports:
  - 'BlogsLoading'
imports_from:
  - '@/components/layout/site-header'
  - '@/components/ui/skeleton'
---

# BlogsLoading

Route: `n/a`  
Kind: loading (Next.js route convention file)  
Rendering: Server  
Auth: n/a

Purpose:
Skeleton fallback for blogs list. Shows 6 article card placeholders in a 3-column grid.

Data:

- _No external data sources_

Business Logic:

- Loops 6 article skeletons
- Each: cover image (aspect-[16/11]), category/featured badge, read time, title, excerpt

Renders:

- SiteHeader (forceSolid)
- Skeleton components

Notes:
Matches ArticleCard layout.
