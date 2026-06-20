'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="rounded-2xl border border-clay/30 bg-clay/5 p-8">
      <h1 className="font-heading text-2xl font-light text-ink">
        Couldn&apos;t load this page
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-60">
        Something went wrong while loading this admin screen. Retry, or open
        another section from the sidebar.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
