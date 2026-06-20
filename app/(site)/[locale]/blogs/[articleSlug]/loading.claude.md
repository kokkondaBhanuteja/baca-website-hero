---
kind: 'loading'
name: 'ArticleLoading'
file: 'app/(site)/[locale]/blogs/[articleSlug]/loading.tsx'
exports:
  - 'ArticleLoading'
imports_from:
  - '@/components/layout/site-header'
  - '@/components/ui/skeleton'
---

# ArticleLoading

Route: `n/a`  
Kind: loading (Next.js route convention file)  
Rendering: Server  
Auth: n/a

Purpose:
Skeleton fallback for article detail page. Shows back link, metadata, cover image, and body paragraph placeholders.

Data:

- _No external data sources_

Business Logic:

- Skeleton for back link
- Skeletons for title (2 lines)
- Skeleton for cover image (aspect-[16/9])
- 12 paragraph placeholders (variable widths)

Renders:

- SiteHeader (forceSolid)
- Skeleton components

Notes:
Uses max-w-3xl to match article layout. Paragraph widths alternate to simulate text flow.
