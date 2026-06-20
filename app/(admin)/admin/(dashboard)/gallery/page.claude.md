---
kind: 'page'
name: 'GalleryAdminPage'
file: 'app/(admin)/admin/(dashboard)/gallery/page.tsx'
exports:
  - 'dynamic'
  - 'GalleryAdminPage'
  - 'default'
imports_from:
  - '@/lib/server/services/gallery-service'
route: '/admin/gallery'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# GalleryAdminPage

Route: `/admin/gallery`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Admin gallery management. Shows GalleryUploaderForm at top (for adding images via signed Cloudinary upload), then grid of uploaded images with captions and delete buttons.

Data:

- listGalleryForAdmin() — all gallery images with imageUrl, caption (LocalizedString), id

Business Logic:

- export const dynamic = 'force-dynamic'
- Renders GalleryUploaderForm above the list
- Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
- Each image: img tag, caption (EN fallback to '—'), DeleteEntityButton

Renders:

- Heading 'Gallery'
- GalleryUploaderForm component
- Image grid with captions and delete buttons

Notes:
GalleryUploaderForm is a client component that signs upload with POST /api/uploads/sign, then uploads directly to Cloudinary. Caption shows EN only.
