'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { galleryApi } from '@/lib/api-client/endpoints/gallery-api'
import type { UploadedImage } from '@/lib/shared/types/upload-dto'
import type { GalleryImageInput } from '@/lib/server/validation/gallery-schema'

import { ImageUploader } from './image-uploader'
import {
  hasAnyLocaleValue,
  LocalizedTextInput,
  type LocalizedDraft,
} from './localized-text-input'

export function GalleryUploaderForm() {
  const router = useRouter()
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [caption, setCaption] = useState<LocalizedDraft>({})
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    if (!image) {
      setError('Upload an image first.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await galleryApi.create({
        caption: hasAnyLocaleValue(caption) ? caption : null,
        imageUrl: image.imageUrl,
        imagePublicId: image.imagePublicId,
        mediaType: 'PHOTO',
        sortOrder: 0,
        isPublished: true,
      } as GalleryImageInput)
      setImage(null)
      setCaption({})
      router.refresh()
    } catch (caught) {
      setError((caught as NormalizedApiError).message ?? 'Could not add image')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-10 max-w-2xl rounded-2xl border border-line bg-paper p-6">
      <h2 className="mb-4 font-heading text-lg font-light text-ink">Add an image</h2>
      {error && (
        <p className="mb-4 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}
      <ImageUploader
        label="Image"
        folder="baca/gallery"
        value={image}
        onChange={setImage}
      />
      <LocalizedTextInput
        label="Caption (optional)"
        value={caption}
        onChange={setCaption}
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={saving || !image}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
      >
        {saving ? 'Adding…' : 'Add to gallery'}
      </button>
    </div>
  )
}
