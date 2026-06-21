'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { blogTypesApi } from '@/lib/api-client/endpoints/blog-types-api'
import type { BlogTypeAdminDto } from '@/lib/shared/types/blog-type-dto'
import type { BlogTypeInput } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

import {
  LocalizedTextInput,
  type LocalizedDraft,
} from '@/app/(admin)/admin/components/localized-text-input'

export function BlogTypeForm({ initial }: { initial?: BlogTypeAdminDto }) {
  const router = useRouter()
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [name, setName] = useState<LocalizedDraft>(initial?.name ?? { en: '' })
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

    const payload = { slug, name, sortOrder, isPublished } as BlogTypeInput

    try {
      if (initial) await blogTypesApi.update(initial.id, payload)
      else await blogTypesApi.create(payload)
      router.push('/admin/blog-types')
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
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <LocalizedTextInput
              label="Name"
              required
              value={name}
              onChange={setName}
              error={fieldErrors['name.en']}
            />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
                >
                  {isSaving ? 'Saving…' : 'Save blog type'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/blog-types')}
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
                  placeholder="recipes"
                  aria-invalid={fieldErrors.slug ? true : undefined}
                  className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                />
                {fieldErrors.slug && (
                  <p className="mt-1 text-xs text-clay">
                    {fieldErrors.slug.join(', ')}
                  </p>
                )}
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
                  onChange={(event) => setSortOrder(Number(event.target.value))}
                  className="w-28 rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
