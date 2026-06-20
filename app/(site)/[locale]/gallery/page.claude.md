---
kind: 'page'
name: 'GalleryPage'
file: 'app/(site)/[locale]/gallery/page.tsx'
exports:
  - 'generateMetadata'
  - 'dynamic'
  - 'GalleryPage'
  - 'default'
imports_from:
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/lib/server/services/gallery-service'
  - '@/components/ui/media-reveal'
  - '@/components/shared/page-intro'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
route: '/[locale]/gallery'
auth: 'Public'
---

# GalleryPage

Route: `/[locale]/gallery`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Public

Purpose:
Gallery of published images. Displays in a responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop) with captions. force-dynamic ensures live updates.

Data:

- listPublishedGallery(locale) — returns gallery images with imageUrl, caption (localized), id

Business Logic:

- export const dynamic = 'force-dynamic'
- setRequestLocale(locale as Locale)
- generateMetadata() fetches 'galleryPage' namespace
- Maps images; renders figure with aspect-square image and optional figcaption

Renders:

- SiteHeader (forceSolid)
- PageIntro
- Image grid (2/3/4 columns responsive)
- SiteFooter

Notes:
Images have hover scale animation (group-hover:scale-[1.05]). Captions are optional per image.
