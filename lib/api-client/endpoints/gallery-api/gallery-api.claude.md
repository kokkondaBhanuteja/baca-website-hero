---
kind: 'endpoint'
name: 'GalleryApi'
file: 'lib/api-client/endpoints/gallery-api/gallery-api.ts'
exports:
  - 'galleryApi'
imports_from:
  - '@/lib/shared/types/gallery-dto'
  - '@/lib/server/validation/gallery-schema'
  - '@/lib/api-client/axios-instance'
called_by:
  - 'app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx'
  - 'app/(admin)/admin/components/gallery-uploader-form/gallery-uploader-form.tsx'
auth: 'All endpoints require valid session cookie (enforced server-side via requireAdmin)'
side_effects: 'HTTP requests to /api/gallery/*; DB mutations server-side.'
---

# GalleryApi

Purpose:
Typed axios wrappers for gallery CRUD endpoints. Used by admin gallery dashboard.

Exports:

- galleryApi: object — { list, create, remove }

Imports from:

- @/lib/shared/types/gallery-dto — GalleryImageAdminDto
- @/lib/server/validation/gallery-schema — GalleryImageInput (type-only import)
- @/lib/api-client/axios-instance — apiClient instance

Called by:

- app/(admin)/admin/(dashboard)/gallery/page.tsx (list view)
- app/(admin)/admin/(dashboard)/gallery/new/page.tsx (new gallery item form)

Business Logic:

- list: GET /api/gallery → returns GalleryImageAdminDto[]
- create: POST /api/gallery with GalleryImageInput body → returns GalleryImageAdminDto
- remove: DELETE /api/gallery/:id → returns undefined

Auth: All endpoints require valid session cookie (enforced server-side via requireAdmin)

Side Effects:
HTTP requests to /api/gallery/\*; DB mutations server-side.

Notes:
Gallery is simpler than products/categories: no edit endpoint (only create/delete). GalleryImageInput is type-only.
