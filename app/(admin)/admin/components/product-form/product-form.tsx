'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { productsApi } from '@/lib/api-client/endpoints/products-api'
import type { ProductAdminDto } from '@/lib/shared/types/catalogue-dto'
import type { UploadedImage } from '@/lib/shared/types/upload-dto'
import type { ProductInput } from '@/lib/server/validation/product-schema'

import { Dropdown } from '@/components/ui/dropdown'

import { ImageUploader } from '@/app/(admin)/admin/components/image-uploader'
import {
  hasAnyLocaleValue,
  LocalizedTextInput,
  type LocalizedDraft,
} from '@/app/(admin)/admin/components/localized-text-input'

export interface CategoryOption {
  id: string
  label: string
}

function imageFrom(entity?: ProductAdminDto): UploadedImage | null {
  return entity?.imageUrl && entity.imagePublicId
    ? { imageUrl: entity.imageUrl, imagePublicId: entity.imagePublicId }
    : null
}

export function ProductForm({
  initial,
  categories,
}: {
  initial?: ProductAdminDto
  categories: CategoryOption[]
}) {
  const router = useRouter()
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? '',
  )
  const [name, setName] = useState<LocalizedDraft>(initial?.name ?? { en: '' })
  const [summary, setSummary] = useState<LocalizedDraft>(initial?.summary ?? {})
  const [description, setDescription] = useState<LocalizedDraft>(
    initial?.description ?? {},
  )
  const [origin, setOrigin] = useState<LocalizedDraft>(initial?.origin ?? {})
  const [specifications, setSpecifications] = useState<LocalizedDraft>(
    initial?.specifications ?? {},
  )
  const [seasonality, setSeasonality] = useState<LocalizedDraft>(
    initial?.seasonality ?? {},
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
      categoryId,
      name,
      summary: hasAnyLocaleValue(summary) ? summary : null,
      description: hasAnyLocaleValue(description) ? description : null,
      origin: hasAnyLocaleValue(origin) ? origin : null,
      specifications: hasAnyLocaleValue(specifications) ? specifications : null,
      seasonality: hasAnyLocaleValue(seasonality) ? seasonality : null,
      imageUrl: image?.imageUrl ?? null,
      imagePublicId: image?.imagePublicId ?? null,
      sortOrder,
      isPublished,
    } as ProductInput

    try {
      if (initial) await productsApi.update(initial.id, payload)
      else await productsApi.create(payload)
      router.push('/admin/products')
      router.refresh()
    } catch (caught) {
      const apiError = caught as NormalizedApiError
      setError(apiError.message)
      setFieldErrors(apiError.fieldErrors ?? {})
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* MAIN — long content */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <LocalizedTextInput
              label="Name"
              required
              value={name}
              onChange={setName}
              error={fieldErrors['name.en']}
            />
            <LocalizedTextInput
              label="Summary"
              value={summary}
              onChange={setSummary}
            />
            <LocalizedTextInput
              label="Description"
              multiline
              value={description}
              onChange={setDescription}
            />
            <LocalizedTextInput
              label="Origin regions"
              value={origin}
              onChange={setOrigin}
            />
            <LocalizedTextInput
              label="Specifications"
              multiline
              value={specifications}
              onChange={setSpecifications}
            />
            <div className="-mb-5">
              <LocalizedTextInput
                label="Seasonality"
                value={seasonality}
                onChange={setSeasonality}
              />
            </div>
          </div>
        </div>

        {/* META SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="submit"
                    disabled={isSaving || categories.length === 0}
                    className="flex-1 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
                  >
                    {isSaving ? 'Saving…' : 'Save product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/admin/products')}
                    className="rounded-full border border-line px-6 py-2.5 text-sm text-ink/70 hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>

                <label className="flex items-center gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(event) => setIsPublished(event.target.checked)}
                  />
                  Published
                </label>
              </div>

              <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <div className="mb-4">
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
                    placeholder="green-cardamom"
                    aria-invalid={fieldErrors.slug ? true : undefined}
                    aria-describedby={
                      fieldErrors.slug ? 'slug-error' : undefined
                    }
                    className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  />
                  {fieldErrors.slug && (
                    <p id="slug-error" className="mt-1 text-xs text-clay">
                      {fieldErrors.slug.join(', ')}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="mb-1.5 block text-sm font-medium text-ink/80"
                    htmlFor="category"
                  >
                    Category <span className="text-clay">*</span>
                  </label>
                  <Dropdown
                    id="category"
                    value={categoryId}
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.label,
                    }))}
                    onChange={setCategoryId}
                    placeholder={
                      categories.length === 0
                        ? 'No categories yet'
                        : 'Select category'
                    }
                    buttonClassName="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink"
                  />
                </div>

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
                    onChange={(event) =>
                      setSortOrder(Number(event.target.value))
                    }
                    className="w-28 rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <ImageUploader
                  label="Product image"
                  folder="baca/products"
                  value={image}
                  onChange={setImage}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
