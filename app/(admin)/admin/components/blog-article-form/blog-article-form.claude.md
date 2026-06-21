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
  - '@/lib/shared/types/blog-type-dto'
  - '@/lib/shared/types/upload-dto'
  - '@/lib/server/validation/blog-article-schema'
  - '@/components/ui/dropdown'
  - '@/app/(admin)/admin/components/image-uploader'
  - '@/app/(admin)/admin/components/localized-text-input'
---

# BlogArticleForm

Purpose:
Blog article create/edit form: slug, blog type dropdown (admin-defined), localized title/excerpt/body, cover image,
author (name/role/avatar), read minutes, status, featured toggle.

Used In:

- Admin blog-articles pages: /new and /[id]/edit

Props:

- initial?: BlogArticleAdminDto — existing article data (if editing); undefined if creating
- blogTypes: BlogTypeAdminDto[] — all admin-defined blog types (fetched server-side by the page)

Business Logic:

- Local state: slug, blogTypeId (defaults to initial.blogTypeId ?? blogTypes[0]?.id ?? ''), title/excerpt/body (LocalizedDraft), cover (UploadedImage), readMinutes, status (DRAFT default), isFeatured
- blogTypeOptions derived from blogTypes prop (value = type.id, label = type.name.en)
- onSubmit: validates, builds payload (with blogTypeId), calls blogArticlesApi.create/update
- On success: router.push('/admin/blog-articles'); router.refresh()
- On error: displays error message + fieldErrors map (keys like 'title.en', 'blogTypeId')
- LocalizedTextInput components for title/excerpt/body with multiline option
- ImageUploader for cover image (folder: 'baca/blog')
- Author card: plain-text Name + Role inputs and an ImageUploader avatar (folder: 'baca/authors'); empty name/role serialized as null
- Status dropdown: DRAFT | PUBLISHED
- Featured checkbox (local state isFeatured; API payload key is featured)

Layout:

- Two-column CMS layout on `lg+` via `grid grid-cols-1 lg:grid-cols-12 lg:gap-8`.
  - MAIN (`lg:col-span-8`): localized Title / Excerpt / Body inside a single bordered card.
  - SIDEBAR / ASIDE (`lg:col-span-4`): four stacked bordered cards — (1) Save+Cancel actions + Status dropdown + Featured checkbox, (2) Slug + Category + Read minutes, (3) Cover image, (4) Author (name + role + avatar uploader).
  - Sidebar is `lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto` so the Save button stays in view while editing the long body field.
- Mobile (`<lg`): everything stacks single column in DOM order — main first, then sidebar cards.
- Form no longer caps at `max-w-2xl`; it spans the full content area so wide screens are used.

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
