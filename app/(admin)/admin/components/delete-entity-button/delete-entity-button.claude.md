---
kind: 'component'
name: 'DeleteEntityButton'
file: 'app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx'
exports:
  - 'DeleteEntityButton'
imports_from:
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/blog-articles-api'
  - '@/lib/api-client/endpoints/categories-api'
  - '@/lib/api-client/endpoints/gallery-api'
  - '@/lib/api-client/endpoints/products-api'
---

# DeleteEntityButton

Purpose:
Generic delete button for admin lists: confirms via window.confirm, then calls the appropriate API delete method.

Used In:

- Admin list pages (products, categories, articles, gallery) — typically in a row action column

Props:

- id: string — entity ID to delete
- kind: 'category' | 'product' | 'article' | 'galleryImage' — entity type (determines which API to call)

Business Logic:

- useState: busy flag
- onClick: shows window.confirm('Delete this item? This cannot be undone.')
- If confirmed: setBusy(true), calls REMOVERS[kind](id) (mapped API method)
- On success: router.refresh() (re-renders page with updated list)
- On error: shows window.alert with error message, setBusy(false) (allows retry)
- Button text: 'Delete' or 'Deleting…' (busy state), disabled while busy

Dependencies:

- React hooks: useState
- next/navigation: useRouter
- @/lib/api-client/endpoints: products-api, categories-api, blog-articles-api, gallery-api

i18n:
None — hardcoded English

Accessibility:
Button is semantic. No aria attributes needed.

Notes:
The REMOVERS map routes kind strings to API methods. Very simple, reusable delete action. Uses browser confirm/alert for UX (could be improved with a modal). No optimistic UI — waits for API response.
