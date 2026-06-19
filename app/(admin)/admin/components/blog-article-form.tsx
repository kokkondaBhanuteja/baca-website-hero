'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { blogArticlesApi } from '@/lib/api-client/endpoints/blog-articles-api'
import type {
  BlogArticleAdminDto,
  BlogCategoryValue,
  ContentStatusValue,
} from '@/lib/shared/types/blog-dto'
import type { UploadedImage } from '@/lib/shared/types/upload-dto'
import type { BlogArticleInput } from '@/lib/server/validation/blog-article-schema'

import { Dropdown } from '@/components/ui/dropdown'

import { ImageUploader } from './image-uploader'
import {
  LocalizedTextInput,
  type LocalizedDraft,
} from './localized-text-input'

const CATEGORY_OPTIONS: { value: BlogCategoryValue; label: string }[] = [
  { value: 'INDUSTRY_INSIGHTS', label: 'Industry Insights' },
  { value: 'IMPACT_STORIES', label: 'Impact Stories' },
  { value: 'COMMUNITY_ENGAGEMENT', label: 'Community Engagement' },
]

function imageFrom(entity?: BlogArticleAdminDto): UploadedImage | null {
  return entity?.coverImageUrl && entity.coverImagePublicId
    ? { imageUrl: entity.coverImageUrl, imagePublicId: entity.coverImagePublicId }
    : null
}

export function BlogArticleForm({ initial }: { initial?: BlogArticleAdminDto }) {
  const router = useRouter()
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [category, setCategory] = useState<BlogCategoryValue>(
    initial?.category ?? 'INDUSTRY_INSIGHTS',
  )
  const [title, setTitle] = useState<LocalizedDraft>(initial?.title ?? { en: '' })
  const [excerpt, setExcerpt] = useState<LocalizedDraft>(
    initial?.excerpt ?? { en: '' },
  )
  const [body, setBody] = useState<LocalizedDraft>(initial?.body ?? { en: '' })
  const [cover, setCover] = useState<UploadedImage | null>(imageFrom(initial))
  const [readMinutes, setReadMinutes] = useState(initial?.readMinutes ?? 3)
  const [status, setStatus] = useState<ContentStatusValue>(
    initial?.status ?? 'DRAFT',
  )
  const [featured, setFeatured] = useState(initial?.featured ?? false)

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setFieldErrors({})

    const payload = {
      slug,
      category,
      title,
      excerpt,
      body,
      coverImageUrl: cover?.imageUrl ?? null,
      coverImagePublicId: cover?.imagePublicId ?? null,
      readMinutes,
      status,
      featured,
    } as BlogArticleInput

    try {
      if (initial) await blogArticlesApi.update(initial.id, payload)
      else await blogArticlesApi.create(payload)
      router.push('/admin/blog-articles')
      router.refresh()
    } catch (caught) {
      const apiError = caught as NormalizedApiError
      setError(apiError.message)
      setFieldErrors(apiError.fieldErrors ?? {})
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && (
        <p className="mb-4 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/80" htmlFor="slug">
            Slug <span className="text-clay">*</span>
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="global-cardamom-demand-2026"
            className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
          {fieldErrors.slug && (
            <p className="mt-1 text-xs text-clay">{fieldErrors.slug.join(', ')}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/80" htmlFor="category">
            Category
          </label>
          <Dropdown
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={(next) => setCategory(next as BlogCategoryValue)}
            buttonClassName="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
          />
        </div>
      </div>

      <LocalizedTextInput label="Title" required value={title} onChange={setTitle} error={fieldErrors['title.en']} />
      <LocalizedTextInput label="Excerpt" multiline required value={excerpt} onChange={setExcerpt} error={fieldErrors['excerpt.en']} />
      <LocalizedTextInput label="Body" multiline required value={body} onChange={setBody} error={fieldErrors['body.en']} />
      <ImageUploader label="Cover image" folder="baca/blog" value={cover} onChange={setCover} />

      <div className="mb-5 flex flex-wrap items-center gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/80" htmlFor="readMinutes">
            Read minutes
          </label>
          <input
            id="readMinutes"
            type="number"
            min={1}
            value={readMinutes}
            onChange={(event) => setReadMinutes(Number(event.target.value))}
            className="w-24 rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/80" htmlFor="status">
            Status
          </label>
          <Dropdown
            value={status}
            options={[
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PUBLISHED', label: 'Published' },
            ]}
            onChange={(next) => setStatus(next as ContentStatusValue)}
            buttonClassName="min-w-[10rem] rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
          />
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
          Featured
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save article'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blog-articles')}
          className="rounded-full border border-line px-6 py-2.5 text-sm text-ink/70 hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
