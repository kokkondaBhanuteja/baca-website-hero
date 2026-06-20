---
kind: 'component'
name: 'GalleryUploaderForm'
file: 'app/(admin)/admin/components/gallery-uploader-form/gallery-uploader-form.tsx'
exports:
  - 'GalleryUploaderForm'
imports_from:
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/gallery-api'
  - '@/lib/shared/types/upload-dto'
  - '@/lib/server/validation/gallery-schema'
  - '@/app/(admin)/admin/components/image-uploader'
  - '@/app/(admin)/admin/components/localized-text-input'
---

# GalleryUploaderForm

Purpose:
Single-image gallery upload form: select image (via ImageUploader), optional caption (via LocalizedTextInput), upload to gallery.

Used In:

- Admin gallery page — used to add new gallery images (not edit)

Props:

- No props — client component

Business Logic:

- Local state: image (UploadedImage or null), caption (LocalizedDraft), error, isSaving
- handleAdd: checks image exists (error if not), calls galleryApi.create({caption, imageUrl, imagePublicId, mediaType: 'PHOTO', sortOrder: 0, isPublished: true})
- On success: resets image + caption, router.refresh()
- On error: displays error message, sets isSaving=false
- ImageUploader for image (folder: 'baca/gallery')
- LocalizedTextInput for optional caption
- Add button disabled if !image or isSaving

Dependencies:

- React hooks: useState
- next/navigation: useRouter
- @/lib/api-client/endpoints/gallery-api
- @/app/(admin)/admin/components: ImageUploader, LocalizedTextInput with hasAnyLocaleValue

i18n:
None — English only

Accessibility:
Labels linked. Disabled state on button.

Notes:
Simpler than the entity forms: only add, no edit (each image is independent). Captions are optional (checked via hasAnyLocaleValue). All new images are published=true, sortOrder=0 by default.
