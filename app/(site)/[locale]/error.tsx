'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

/**
 * Site-wide error boundary. Client component — receives `error` + `reset` from
 * React's error boundary contract. Renders a standalone screen (no SiteHeader)
 * because the header itself fetches DB data and may be what failed; we keep this
 * boundary self-contained.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-5 py-20 sm:px-8">
      <section className="mx-auto max-w-content text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-60">
          {t('eyebrow')}
        </p>
        <h1 className="mx-auto mt-5 max-w-[24ch] text-balance font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
          {t('title')}
        </h1>
        <p className="mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink-60">
          {t('body')}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-forest"
          >
            {t('retry')}
          </button>
          <Link
            href={Route.Home}
            className="rounded-full border border-line px-6 py-3 text-sm text-ink/75 transition-colors hover:text-ink"
          >
            {t('home')}
          </Link>
        </div>
      </section>
    </main>
  )
}
