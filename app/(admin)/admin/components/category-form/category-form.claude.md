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

Dependencies:

- React hooks: useState
- next/navigation: useRouter
- @/lib/api-client/endpoints/categories-api
- @/lib/shared/types/catalogue-dto
- @/components/ui/dropdown
- @/app/(admin)/admin/components/\* (ImageUploader, LocalizedTextInput with hasAnyLocaleValue)

i18n:
None — English only

Accessibility:
Labels linked. Required fields marked.

Notes:
Similar to BlogArticleForm. The description is optional and only sent if any locale has content (hasAnyLocaleValue check). Sort order allows manual category reordering on the public page.
