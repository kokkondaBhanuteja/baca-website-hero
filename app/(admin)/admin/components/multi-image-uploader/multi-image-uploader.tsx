'use client'

import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { uploadsApi } from '@/lib/api-client/endpoints/uploads-api'
import type { ProductImage } from '@/lib/shared/types/catalogue-dto'
import type { UploadFolder } from '@/lib/shared/types/upload-dto'

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

/**
 * Uploads several images into one ordered list. The FIRST image is the cover
 * (used on cards / grid); all images show in the detail-page carousel. Supports
 * add (multi-select), remove, and "Set as cover" (move to front). Each file is
 * signed + uploaded through the same flow as the single ImageUploader.
 */
export function MultiImageUploader({
  label,
  hint,
  folder,
  value,
  onChange,
  max = 12,
}: {
  label: string
  hint?: string
  folder: UploadFolder
  value: ProductImage[]
  onChange: (images: ProductImage[]) => void
  max?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reactId = useId()
  const inputId = `${reactId}-file`

  const isMountedRef = useRef(true)
  useEffect(
    () => () => {
      isMountedRef.current = false
    },
    [],
  )

  async function uploadOne(file: File): Promise<ProductImage> {
    const signature = await uploadsApi.sign(folder)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', signature.apiKey)
    formData.append('timestamp', String(signature.timestamp))
    formData.append('signature', signature.signature)
    formData.append('folder', signature.folder)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      { method: 'POST', body: formData },
    )
    if (!response.ok) throw new Error('Cloudinary rejected the upload')
    const data = (await response.json()) as CloudinaryUploadResponse
    return { url: data.secure_url, publicId: data.public_id }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    const toUpload = files.slice(0, max - value.length)

    setUploading(true)
    setError(null)
    try {
      const uploaded: ProductImage[] = []
      for (const file of toUpload) {
        uploaded.push(await uploadOne(file))
      }
      if (!isMountedRef.current) return
      onChange([...value, ...uploaded])
    } catch (caught) {
      if (!isMountedRef.current) return
      setError(
        (caught as NormalizedApiError)?.message ??
          (caught instanceof Error ? caught.message : 'Upload failed'),
      )
    } finally {
      if (isMountedRef.current) setUploading(false)
      event.target.value = ''
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, currentIndex) => currentIndex !== index))
  }

  function makeCover(index: number) {
    if (index === 0) return
    const next = [...value]
    const [image] = next.splice(index, 1)
    next.unshift(image)
    onChange(next)
  }

  const atCapacity = value.length >= max

  return (
    <div className="mb-5">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-ink/80"
      >
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-ink-60">{hint}</p>}

      <div className="flex flex-wrap gap-3">
        {value.map((image, index) => (
          <div
            key={image.publicId}
            className="group relative h-32 w-32 overflow-hidden rounded-lg border border-line"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={index === 0 ? 'Cover image' : `Image ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {index === 0 ? (
              <span className="absolute start-1 top-1 rounded-full bg-ink/80 px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wider text-paper">
                Cover
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(index)}
                className="absolute inset-x-0 bottom-0 bg-ink/70 py-1 text-center font-mono text-[0.55rem] uppercase tracking-wider text-paper opacity-0 transition-opacity group-hover:opacity-100"
              >
                Set as cover
              </button>
            )}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Remove image ${index + 1}`}
              className="absolute -end-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-sm hover:text-clay"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {!atCapacity && (
          <label
            htmlFor={inputId}
            className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-paper text-ink-60 transition-colors hover:border-ink/40 hover:text-ink"
          >
            <ImagePlus className="h-6 w-6" aria-hidden />
            <span className="text-xs">
              {uploading ? 'Uploading…' : 'Add images'}
            </span>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-clay">
          {error}
        </p>
      )}
    </div>
  )
}
