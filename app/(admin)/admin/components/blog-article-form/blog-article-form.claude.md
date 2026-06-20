---
kind: 'component'
name: 'BlogArticleForm'
file: 'app/(admin)/admin/components/blog-article-form/blog-article-form.tsx'
exports:
  - 'BlogArticleForm'
imports_from:
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/blog-articles-api'
  - '@/lib/shared/types/blog-dto'
  - '@/lib/shared/types/upload-dto'
  - '@/lib/server/validation/blog-article-schema'
  - '@/components/ui/dropdown'
  - '@/app/(admin)/admin/components/image-uploader'
  - '@/app/(admin)/admin/components/localized-text-input'
---

# BlogArticleForm

Purpose:
Blog article create/edit form: slug, category dropdown, localized title/excerpt/body, cover image, read minutes, status, featured toggle.

Used In:

- Admin blog-articles pages: /new and /[id]/edit

Props:

- initial?: BlogArticleAdminDto — existing article data (if editing); undefined if creating

Business Logic:

- Local state: slug, category (INDUSTRY_INSIGHTS default), title/excerpt/body (LocalizedDraft), cover (UploadedImage), readMinutes, status (DRAFT default), isFeatured
- onSubmit: validates, builds payload, calls blogArticlesApi.create/update
- On success: router.push('/admin/blog-articles'); router.refresh()
- On error: displays error message + fieldErrors map (keys like 'title.en')
- LocalizedTextInput components for title/excerpt/body with multiline option
- ImageUploader for cover image (folder: 'baca/blog')
- Status dropdown: DRAFT | PUBLISHED
- Featured checkbox

Dependencies:

- React hooks: useState
- next/navigation: useRouter
- @/lib/api-client/endpoints/blog-articles-api
- @/lib/shared/types/blog-dto
- @/components/ui/dropdown
- @/app/(admin)/admin/components/\*

i18n:
None — English only

Accessibility:
Labels linked to inputs via htmlFor. Required fields marked with asterisk.

Notes:
LocalizedDraft allows editing multiple locales. The form splits title/excerpt/body into separate LocalizedTextInput fields (each with locale tabs). The featured state is local as isFeatured but serialized as featured in the API payload.
