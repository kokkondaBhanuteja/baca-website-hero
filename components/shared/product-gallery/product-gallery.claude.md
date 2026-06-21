---
kind: 'component'
name: 'ProductGallery'
file: 'components/shared/product-gallery/product-gallery.tsx'
exports: ['ProductGallery']
imports_from:
  - 'react'
  - 'lucide-react'
  - '@/lib/utils'
---

# ProductGallery

Purpose:
Image carousel shown directly below the heading on the product detail page.
Client component: a horizontal scroll-snap track (native touch swipe) with
prev/next arrows and dot indicators. A single image renders without controls;
an empty list renders nothing.

Used In:

- `app/(site)/[locale]/products/[slug]/page.tsx`

Business Logic:

- `scrollToIndex` scrolls the track by `clientWidth` per slide (smooth); the
  `scroll` handler derives the active index from `scrollLeft / clientWidth`.
- Arrows disable + fade at the ends; dots reflect/seek the active slide.
- Slides are `aspect-[16/10] object-cover`. Native scrollbar hidden.

Props: `images: string[]` (resolved URLs), `alt: string` (product name).

Dependencies: lucide ChevronLeft/Right, cn.
