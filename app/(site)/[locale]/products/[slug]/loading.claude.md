---
kind: 'loading'
name: 'ProductDetailLoading'
file: 'app/(site)/[locale]/products/[slug]/loading.tsx'
exports:
  - 'ProductDetailLoading'
imports_from:
  - '@/components/layout/site-header'
  - '@/components/ui/skeleton'
---

# ProductDetailLoading

Route: `n/a`
Kind: loading (Next.js route convention file)
Rendering: Server
Auth: n/a

Purpose:
Skeleton fallback while the product detail page loads. Mirrors the final structure: a full-bleed
hero placeholder, description lines, a 3-column attribute block, and two CTA pills.

Data:

- _No external data sources_

Business Logic:

- Renders the transparent `SiteHeader` (matches the page).
- Hero placeholder is a `bg-bone` block of the same `min-h-[68svh]` as `MediaHero`.
- Skeletons for eyebrow/title/summary, three description lines, three attribute columns, two pills.

Renders:

- SiteHeader · Skeleton blocks

Notes:
Layout matches `ProductDetailPage` so the swap to real content doesn't shift.
