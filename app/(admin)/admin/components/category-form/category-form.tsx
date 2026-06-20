'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { categoriesApi } from '@/lib/api-client/endpoints/categories-api'
import type { ProductCategoryAdminDto } from '@/lib/shared/types/catalogue-dto'
import type { UploadedImage } from '@/lib/shared/types/upload-dto'
import type { CategoryInput } from '@/lib/server/validation/category-schema'

import { ImageUploader } from '@/app/(admin)/admin/components/image-uploader'
import {
  hasAnyLocaleValue,
  LocalizedTextInput,
  type LocalizedDraft,
} from '@/app/(admin)/admin/components/localized-text-input'

function imageFrom(entity?: ProductCategoryAdminDto): UploadedImage | null {
  return entity?.imageUrl && entity.imagePublicId
    ? { imageUrl: entity.imageUrl, imagePublicId: entity.imagePublicId }
    : null
}

export function CategoryForm({
  initial,
}: {
  initial?: ProductCategoryAdminDto
}) {
  const router = useRouter()
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [name, setName] = useState<LocalizedDraft>(initial?.name ?? { en: '' })
  const [description, setDescription] = useState<LocalizedDraft>(
    initial?.description ?? {},
  )
  const [image, setImage] = useState<UploadedImage | null>(imageFrom(initial))
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true)

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)
    setFieldErrors({})

    const payload = {
      slug,
      name,
      description: hasAnyLocaleValue(description) ? description : null,
      imageUrl: image?.imageUrl ?? null,
      imagePublicId: image?.imagePublicId ?? null,
      sortOrder,
      isPublished,
    } as CategoryInput

    try {
      if (initial) await categoriesApi.update(initial.id, payload)
      else await categoriesApi.create(payload)
      router.push('/admin/categories')
      router.refresh()
    } catch (caught) {
      const apiError = caught as NormalizedApiError
      setError(apiError.message)
      setFieldErrors(apiError.fieldErrors ?? {})
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <p className="mb-4 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}

      <div className="mb-5">
        <label
          className="mb-1.5 block text-sm font-medium text-ink/80"
          htmlFor="slug"
        >
          Slug <span className="text-clay">*</span>
        </label>
        <input
          id="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="spices"
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
        {fieldErrors.slug && (
          <p className="mt-1 text-xs text-clay">
            {fieldErrors.slug.join(', ')}
          </p>
        )}
      </div>

      <LocalizedTextInput
        label="Name"
        required
        value={name}
        onChange={setName}
        error={fieldErrors['name.en']}
      />
      <LocalizedTextInput
        label="Description"
        multiline
        value={description}
        onChange={setDescription}
      />
      <ImageUploader
        label="Category image"
        folder="baca/categories"
        value={image}
        onChange={setImage}
      />

      <div className="mb-5 flex items-center gap-6">
        <div>
          <label
            className="mb-1.5 block text-sm font-medium text-ink/80"
            htmlFor="sortOrder"
          >
            Sort order
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(event) => setSortOrder(Number(event.target.value))}
            className="w-28 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
          />
          Published
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save category'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/categories')}
          className="rounded-full border border-line px-6 py-2.5 text-sm text-ink/70 hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
