'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface UseAdminListUrlStateArgs {
  initialSearch: string
  debounceMs?: number
}

export interface AdminListUrlState {
  searchValue: string
  onSearchChange: (next: string) => void
  onPageChange: (next: number) => void
  isPending: boolean
}

const DEFAULT_DEBOUNCE_MS = 300

export function useAdminListUrlState({
  initialSearch,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: UseAdminListUrlStateArgs): AdminListUrlState {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [lastInitialSearch, setLastInitialSearch] = useState(initialSearch)
  const [isPending, startTransition] = useTransition()

  // Re-sync local input when the URL changes externally (back/forward / direct
  // link). Without this, navigating away and back keeps stale local state.
  // setState-during-render is React 19's canonical replacement for the old
  // useEffect+setState resync pattern.
  if (initialSearch !== lastInitialSearch) {
    setLastInitialSearch(initialSearch)
    setSearchValue(initialSearch)
  }

  useEffect(() => {
    if (searchValue === initialSearch) return
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmed = searchValue.trim()
      if (trimmed) params.set('q', trimmed)
      else params.delete('q')
      params.delete('page')
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, debounceMs)
    return () => clearTimeout(timer)
  }, [searchValue, initialSearch, pathname, router, searchParams, debounceMs])

  function handlePageChange(next: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (next <= 1) params.delete('page')
    else params.set('page', String(next))
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return {
    searchValue,
    onSearchChange: setSearchValue,
    onPageChange: handlePageChange,
    isPending,
  }
}
