'use client'

import { useState, type ChangeEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { uploadsApi } from '@/lib/api-client/endpoints/uploads-api'
import type { UploadedImage, UploadFolder } from '@/lib/shared/types/upload-dto'

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
}

export function ImageUploader({
  label,
  folder,
  value,
  onChange,
}: {
  label: string
  folder: UploadFolder
  value: UploadedImage | null
  onChange: (image: UploadedImage | null) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
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
      onChange({ imageUrl: data.secure_url, imagePublicId: data.public_id })
    } catch (caught) {
      const message =
        (caught as NormalizedApiError)?.message ??
        (caught instanceof Error ? caught.message : 'Upload failed')
      setError(message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="mb-5">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
      </span>

      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.imageUrl}
            alt="Uploaded preview"
            className="h-40 w-40 rounded-lg border border-line object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove image"
            className="absolute -end-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-sm hover:text-clay"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-paper text-ink-60 transition-colors hover:border-ink/40 hover:text-ink">
          <ImagePlus className="h-6 w-6" />
          <span className="text-xs">
            {uploading ? 'Uploading…' : 'Upload image'}
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="mt-2 text-xs text-clay">{error}</p>}
    </div>
  )
}
