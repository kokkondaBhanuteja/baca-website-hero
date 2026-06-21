'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { blogArticlesApi } from '@/lib/api-client/endpoints/blog-articles-api'
import { blogTypesApi } from '@/lib/api-client/endpoints/blog-types-api'
import { categoriesApi } from '@/lib/api-client/endpoints/categories-api'
import { galleryApi } from '@/lib/api-client/endpoints/gallery-api'
import { productsApi } from '@/lib/api-client/endpoints/products-api'

type EntityKind =
  | 'category'
  | 'product'
  | 'article'
  | 'galleryImage'
  | 'blogType'

const REMOVERS: Record<EntityKind, (id: string) => Promise<unknown>> = {
  category: categoriesApi.remove,
  product: productsApi.remove,
  article: blogArticlesApi.remove,
  galleryImage: galleryApi.remove,
  blogType: blogTypesApi.remove,
}

export function DeleteEntityButton({
  id,
  kind,
  /** Optional row label (e.g. product name) so the accessible name is per-row. */
  label,
}: {
  id: string
  kind: EntityKind
  label?: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    setBusy(true)
    try {
      await REMOVERS[kind](id)
      router.refresh()
    } catch (caught) {
      window.alert((caught as NormalizedApiError).message ?? 'Delete failed')
      setBusy(false)
    }
  }

  // Build a descriptive accessible name so screen-reader users on a list of
  // many "Delete" buttons know which row each one belongs to.
  const accessibleName = label
    ? `Delete ${kind} ${label}`
    : `Delete this ${kind}`

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      aria-label={accessibleName}
      className="text-sm text-ink-60 transition-colors hover:text-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:opacity-50"
    >
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  )
}
