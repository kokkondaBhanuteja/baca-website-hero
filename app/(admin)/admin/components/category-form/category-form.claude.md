---
kind: 'component'
name: 'CategoryForm'
file: 'app/(admin)/admin/components/category-form/category-form.tsx'
exports:
  - 'CategoryForm'
imports_from:
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/categories-api'
  - '@/lib/shared/types/catalogue-dto'
  - '@/lib/shared/types/upload-dto'
  - '@/lib/server/validation/category-schema'
  - '@/app/(admin)/admin/components/image-uploader'
  - '@/app/(admin)/admin/components/localized-text-input'
---

# CategoryForm

Purpose:
Product category create/edit form: slug, localized name/description, category image, sort order, published toggle.

Used In:

- Admin categories pages: /new and /[id]/edit

Props:

- initial?: ProductCategoryAdminDto — existing category (if editing)

Business Logic:

- Local state: slug, name (LocalizedDraft), description (LocalizedDraft, optional), image, sortOrder, isPublished
- onSubmit builds payload, calls categoriesApi.create/update
- Validates description via hasAnyLocaleValue() before including in payload (null if empty)
- LocalizedTextInput for name (required), description (multiline, optional)
- ImageUploader for category image (folder: 'baca/categories')
- Sort order: number input
- Published checkbox

Layout:

- Two-column CMS layout on `lg+` via `grid grid-cols-1 lg:grid-cols-12 lg:gap-8`.
  - MAIN (`lg:col-span-8`): localized Name / Description in a single bordered card.
  - SIDEBAR (`lg:col-span-4`): three stacked cards — Save+Cancel + Published checkbox; Slug + Sort order; Category image.
  - Sidebar is `lg:sticky lg:top-6` so actions stay visible while scrolling.
- Mobile: single-column stack.

Dependencies:

- React hooks: useState
- next/navigation: useRouter
- @/lib/api-client/endpoints/categories-api
- @/lib/shared/types/catalogue-dto
- @/app/(admin)/admin/components/\* (ImageUploader, LocalizedTextInput with hasAnyLocaleValue)

i18n:
None — English only

Accessibility:
Labels linked. Required fields marked.

Notes:
Similar to BlogArticleForm. The description is optional and only sent if any locale has content (hasAnyLocaleValue check). Sort order allows manual category reordering on the public page.
