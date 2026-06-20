---
kind: 'api-route'
name: 'GalleryApi'
file: 'app/api/gallery/route.ts'
exports:
  - 'GET'
  - 'POST'
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/gallery-service'
  - '@/lib/server/validation/gallery-schema'
route: '/api/gallery'
methods:
  - 'GET'
  - 'POST'
---

# GalleryApi

Route: `/api/gallery`  
Methods: GET, POST  
Envelope: via handleRoute

Purpose:
Gallery image management. GET lists all gallery images (admin). POST creates/adds new image (admin).

## Per-method

### GET

- **Auth:** requireAdmin
- **Validation:** None
- **Service:** listGalleryForAdmin() — returns all gallery images with captions (LocalizedString)
- **Response:** ok(images)
- **Errors:** 401

### POST

- **Auth:** requireAdmin
- **Validation:** galleryImageInputSchema — imageUrl (string), caption (LocalizedDraft, optional), isPublished (boolean)
- **Service:** createGalleryImage(input)
- **Response:** created(image) — 201
- **Errors:** 400, 401

Notes:
imageUrl is expected to be the Cloudinary URL returned after admin signs and uploads directly.
