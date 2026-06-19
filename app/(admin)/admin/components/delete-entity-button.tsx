'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { blogArticlesApi } from '@/lib/api-client/endpoints/blog-articles-api'
import { categoriesApi } from '@/lib/api-client/endpoints/categories-api'
import { galleryApi } from '@/lib/api-client/endpoints/gallery-api'
import { productsApi } from '@/lib/api-client/endpoints/products-api'

type EntityKind = 'category' | 'product' | 'article' | 'galleryImage'

const REMOVERS: Record<EntityKind, (id: string) => Promise<unknown>> = {
  category: categoriesApi.remove,
  product: productsApi.remove,
  article: blogArticlesApi.remove,
  galleryImage: galleryApi.remove,
}

export function DeleteEntityButton({
  id,
  kind,
}: {
  id: string
  kind: EntityKind
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

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="text-sm text-ink-60 transition-colors hover:text-clay disabled:opacity-50"
    >
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  )
}
