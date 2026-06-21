'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { productsApi } from '@/lib/api-client/endpoints/products-api'
import type {
  ProductAdminDto,
  ProductImage,
  ProductSpec,
} from '@/lib/shared/types/catalogue-dto'
import type { ProductInput } from '@/lib/server/validation/product-schema'

import { Dropdown } from '@/components/ui/dropdown'

import { MultiImageUploader } from '@/app/(admin)/admin/components/multi-image-uploader'
import {
  hasAnyLocaleValue,
  LocalizedTextInput,
  type LocalizedDraft,
} from '@/app/(admin)/admin/components/localized-text-input'
import { SpecListInput } from '@/app/(admin)/admin/components/spec-list-input'
import { MonthPicker } from '@/app/(admin)/admin/components/month-picker'

export interface CategoryOption {
  id: string
  label: string
}

function imagesFrom(entity?: ProductAdminDto): ProductImage[] {
  if (entity?.images?.length) return entity.images
  // Legacy single-image products → seed the gallery with the existing cover.
  if (entity?.imageUrl && entity.imagePublicId) {
    return [{ url: entity.imageUrl, publicId: entity.imagePublicId }]
  }
  return []
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
  const [botanicalName, setBotanicalName] = useState(
    initial?.botanicalName ?? '',
  )
  const [originRegions, setOriginRegions] = useState(
    (initial?.originRegions ?? []).join('\n'),
  )
  const [specs, setSpecs] = useState<ProductSpec[]>(initial?.specs ?? [])
  const [harvestMonths, setHarvestMonths] = useState<number[]>(
    initial?.harvestMonths ?? [],
  )
  const [peakMonths, setPeakMonths] = useState<number[]>(
    initial?.peakMonths ?? [],
  )
  const [images, setImages] = useState<ProductImage[]>(imagesFrom(initial))
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
      botanicalName: botanicalName.trim() || null,
      originRegions: originRegions
        .split('\n')
        .map((region) => region.trim())
        .filter(Boolean),
      specs: specs.filter((spec) => spec.label.trim() && spec.value.trim()),
      harvestMonths,
      peakMonths,
      images,
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
              hint="Short one-line lead shown on cards and at the top of the product page."
              value={summary}
              onChange={setSummary}
            />
            <LocalizedTextInput
              label="Details (Markdown)"
              hint="Paste the full product details as Markdown — narrative plus a specs table. # headings, **bold**, lists, links and | tables | render on the product page."
              multiline
              rows={16}
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <h2 className="text-sm font-medium text-ink">
              Advanced attributes{' '}
              <span className="font-normal text-ink-60">(optional)</span>
            </h2>
            <p className="mb-5 mt-1 text-xs text-ink-60">
              For products that want the structured pills, specs grid and
              seasonality calendar. Leave blank if everything is in the Details
              body above.
            </p>

            <div className="mb-5">
              <label
                htmlFor="botanicalName"
                className="mb-1.5 block text-sm font-medium text-ink/80"
              >
                Botanical name
              </label>
              <input
                id="botanicalName"
                value={botanicalName}
                onChange={(event) => setBotanicalName(event.target.value)}
                placeholder="Elettaria cardamomum"
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm italic text-ink outline-none focus:border-ink"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="originRegions"
                className="mb-1.5 block text-sm font-medium text-ink/80"
              >
                Origin regions
              </label>
              <p className="mb-2 text-xs text-ink-60">One region per line.</p>
              <textarea
                id="originRegions"
                rows={4}
                value={originRegions}
                onChange={(event) => setOriginRegions(event.target.value)}
                placeholder={'Coorg, Kerala\nWayanad, Kerala\nIdukki, Kerala'}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
              />
            </div>

            <SpecListInput value={specs} onChange={setSpecs} />

            <MonthPicker
              label="Harvest months"
              value={harvestMonths}
              onChange={setHarvestMonths}
            />
            <div className="-mb-5">
              <MonthPicker
                label="Peak months"
                value={peakMonths}
                onChange={setPeakMonths}
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
                <MultiImageUploader
                  label="Product images"
                  hint="First image is the cover (cards & grid). All images show in the carousel on the product page. Use “Set as cover” to choose which leads."
                  folder="baca/products"
                  value={images}
                  onChange={setImages}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
