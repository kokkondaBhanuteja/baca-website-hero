---
kind: 'api-route'
name: 'GalleryImageDetailApi'
file: 'app/api/gallery/[id]/route.ts'
exports:
  - 'DELETE'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/gallery-service'
route: '/api/gallery/[id]'
methods:
  - 'DELETE'
---

# GalleryImageDetailApi

Route: `/api/gallery/[id]`  
Methods: DELETE  
Envelope: via handleRoute

Purpose:
Delete a single gallery image (admin only).

## Per-method

### DELETE

- **Auth:** requireAdmin
- **Validation:** None
- **Service:** deleteGalleryImage(id)
- **Response:** noContent() — 204
- **Errors:** 401, 404

Notes:
GET/PATCH not implemented for gallery images. Images are create-once, delete-only (no edit).
