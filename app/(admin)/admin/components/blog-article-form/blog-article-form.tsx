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

import { ImageUploader } from '@/app/(admin)/admin/components/image-uploader'
import {
  LocalizedTextInput,
  type LocalizedDraft,
} from '@/app/(admin)/admin/components/localized-text-input'

const CATEGORY_OPTIONS: { value: BlogCategoryValue; label: string }[] = [
  { value: 'INDUSTRY_INSIGHTS', label: 'Industry Insights' },
  { value: 'IMPACT_STORIES', label: 'Impact Stories' },
  { value: 'COMMUNITY_ENGAGEMENT', label: 'Community Engagement' },
]

const STATUS_OPTIONS: { value: ContentStatusValue; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
]

function imageFrom(entity?: BlogArticleAdminDto): UploadedImage | null {
  return entity?.coverImageUrl && entity.coverImagePublicId
    ? {
        imageUrl: entity.coverImageUrl,
        imagePublicId: entity.coverImagePublicId,
      }
    : null
}

function avatarFrom(entity?: BlogArticleAdminDto): UploadedImage | null {
  return entity?.authorAvatarUrl && entity.authorAvatarPublicId
    ? {
        imageUrl: entity.authorAvatarUrl,
        imagePublicId: entity.authorAvatarPublicId,
      }
    : null
}

export function BlogArticleForm({
  initial,
}: {
  initial?: BlogArticleAdminDto
}) {
  const router = useRouter()
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [category, setCategory] = useState<BlogCategoryValue>(
    initial?.category ?? 'INDUSTRY_INSIGHTS',
  )
  const [title, setTitle] = useState<LocalizedDraft>(
    initial?.title ?? { en: '' },
  )
  const [excerpt, setExcerpt] = useState<LocalizedDraft>(
    initial?.excerpt ?? { en: '' },
  )
  const [body, setBody] = useState<LocalizedDraft>(initial?.body ?? { en: '' })
  const [cover, setCover] = useState<UploadedImage | null>(imageFrom(initial))
  const [authorName, setAuthorName] = useState(initial?.authorName ?? '')
  const [authorRole, setAuthorRole] = useState(initial?.authorRole ?? '')
  const [avatar, setAvatar] = useState<UploadedImage | null>(
    avatarFrom(initial),
  )
  const [readMinutes, setReadMinutes] = useState(initial?.readMinutes ?? 3)
  const [status, setStatus] = useState<ContentStatusValue>(
    initial?.status ?? 'DRAFT',
  )
  const [isFeatured, setIsFeatured] = useState(initial?.featured ?? false)

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
      category,
      title,
      excerpt,
      body,
      coverImageUrl: cover?.imageUrl ?? null,
      coverImagePublicId: cover?.imagePublicId ?? null,
      authorName: authorName.trim() || null,
      authorRole: authorRole.trim() || null,
      authorAvatarUrl: avatar?.imageUrl ?? null,
      authorAvatarPublicId: avatar?.imagePublicId ?? null,
      readMinutes,
      status,
      featured: isFeatured,
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
              label="Title"
              required
              value={title}
              onChange={setTitle}
              error={fieldErrors['title.en']}
            />
            <LocalizedTextInput
              label="Excerpt"
              multiline
              required
              value={excerpt}
              onChange={setExcerpt}
              error={fieldErrors['excerpt.en']}
            />
            <div className="-mb-5">
              <LocalizedTextInput
                label="Body"
                multiline
                required
                value={body}
                onChange={setBody}
                error={fieldErrors['body.en']}
              />
            </div>
          </div>
        </div>

        {/* META SIDEBAR — short fields + actions */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
                  >
                    {isSaving ? 'Saving…' : 'Save article'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/admin/blog-articles')}
                    className="rounded-full border border-line px-6 py-2.5 text-sm text-ink/70 hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mb-4">
                  <label
                    className="mb-1.5 block text-sm font-medium text-ink/80"
                    htmlFor="status"
                  >
                    Status
                  </label>
                  <Dropdown
                    id="status"
                    value={status}
                    options={STATUS_OPTIONS}
                    onChange={(next) => setStatus(next as ContentStatusValue)}
                    buttonClassName="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(event) => setIsFeatured(event.target.checked)}
                  />
                  Featured
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
                    placeholder="global-cardamom-demand-2026"
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
                    Category
                  </label>
                  <Dropdown
                    id="category"
                    value={category}
                    options={CATEGORY_OPTIONS}
                    onChange={(next) => setCategory(next as BlogCategoryValue)}
                    buttonClassName="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink"
                  />
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium text-ink/80"
                    htmlFor="readMinutes"
                  >
                    Read minutes
                  </label>
                  <input
                    id="readMinutes"
                    type="number"
                    min={1}
                    value={readMinutes}
                    onChange={(event) =>
                      setReadMinutes(Number(event.target.value))
                    }
                    className="w-24 rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <ImageUploader
                  label="Cover image"
                  folder="baca/blog"
                  value={cover}
                  onChange={setCover}
                />
              </div>

              <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                <p className="mb-3 text-sm font-medium text-ink/80">
                  Author{' '}
                  <span className="font-normal text-ink/45">
                    (falls back to “BACA Team”)
                  </span>
                </p>
                <div className="mb-4">
                  <label
                    className="mb-1.5 block text-sm font-medium text-ink/80"
                    htmlFor="authorName"
                  >
                    Name
                  </label>
                  <input
                    id="authorName"
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    placeholder="BACA Team"
                    className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="mb-1.5 block text-sm font-medium text-ink/80"
                    htmlFor="authorRole"
                  >
                    Role
                  </label>
                  <input
                    id="authorRole"
                    value={authorRole}
                    onChange={(event) => setAuthorRole(event.target.value)}
                    placeholder="Editorial"
                    className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                  />
                </div>
                <ImageUploader
                  label="Author avatar"
                  folder="baca/authors"
                  value={avatar}
                  onChange={setAvatar}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
