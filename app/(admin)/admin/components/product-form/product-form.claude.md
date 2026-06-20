---
kind: 'component'
name: 'ProductForm'
file: 'app/(admin)/admin/components/product-form/product-form.tsx'
exports:
  - 'ProductForm'
  - 'CategoryOption'
imports_from:
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/products-api'
  - '@/lib/shared/types/catalogue-dto'
  - '@/lib/shared/types/upload-dto'
  - '@/lib/server/validation/product-schema'
  - '@/components/ui/dropdown'
  - '@/app/(admin)/admin/components/image-uploader'
  - '@/app/(admin)/admin/components/localized-text-input'
---

# ProductForm

Purpose:
Product create/edit form: slug, category dropdown, localized name/summary/description, product image, sort order, published toggle.

Used In:

- Admin products pages: /new and /[id]/edit

Props:

- initial?: ProductAdminDto — existing product (if editing)
- categories: CategoryOption[] — available categories for dropdown

Business Logic:

- Local state: slug, categoryId, name/summary/description (LocalizedDraft), image, sortOrder, isPublished
- onSubmit: builds payload, calls productsApi.create/update
- Category dropdown uses categories array (id → label mapping); default to first if available
- Name is required, summary/description optional (checked via hasAnyLocaleValue)
- ImageUploader (folder: 'baca/products')
- Sort order: number input
- Published checkbox
- Submit button disabled if categories.length === 0 (no category to select)

Layout:

- Two-column CMS layout on `lg+` via `grid grid-cols-1 lg:grid-cols-12 lg:gap-8`.
  - MAIN (`lg:col-span-8`): localized Name / Summary / Description in a single bordered card.
  - SIDEBAR (`lg:col-span-4`): three stacked cards — Save+Cancel + Published checkbox; Slug + Category + Sort order; Product image.
  - Sidebar is `lg:sticky lg:top-6` so actions stay visible while scrolling long descriptions.
- Mobile: single-column stack.
- No more `max-w-2xl`; the form spans the full content area.

Dependencies:

- React hooks: useState
- next/navigation: useRouter
- @/lib/api-client/endpoints/products-api
- @/lib/shared/types/catalogue-dto
- @/components/ui/dropdown
- @/app/(admin)/admin/components/\*

i18n:
None — English only

Accessibility:
Labels linked. Required fields marked.

Notes:
Requires a categories list passed as prop (fetched from the parent edit/new page server component). The categoryId is the foreign key stored in the DB. The form is disabled if no categories exist (edge case, typically won't happen).
