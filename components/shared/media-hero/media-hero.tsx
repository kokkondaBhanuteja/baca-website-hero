import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/eyebrow'

interface MediaHeroProps {
  /** Full-bleed background image (delivery URL). Falls back to a bone panel. */
  imageUrl: string | null
  imageAlt: string
  /** Small mono label above the title (category / section). */
  eyebrow: string
  title: string
  /** Meta row rendered under the title (byline, date, summary, …). */
  children?: ReactNode
}

/**
 * Full-bleed editorial hero shared by the product- and article-detail pages: a
 * cover image under a dark bottom gradient, with an overlaid eyebrow, oversized
 * title, and a meta slot. The only difference between the two pages is what they
 * pass as `children`. Sits beneath the transparent SiteHeader (dark image keeps
 * the light nav legible).
 */
export function MediaHero({
  imageUrl,
  imageAlt,
  eyebrow,
  title,
  children,
}: MediaHeroProps) {
  return (
    <section className="relative isolate flex min-h-[68svh] w-full items-end overflow-hidden bg-ink">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-bone" aria-hidden />
      )}
      {/* Legibility gradient — darker toward the bottom where the text sits. */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/20"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-content px-5 pb-12 pt-header-base sm:px-8 sm:pb-16">
        <Eyebrow className="mb-5 text-paper/70">{eyebrow}</Eyebrow>
        <h1 className="max-w-[20ch] text-balance font-heading text-[clamp(2.1rem,5.5vw,4rem)] font-light leading-[1.04] tracking-[-0.02em] text-paper">
          {title}
        </h1>
        {children && (
          <div className="mt-6 text-paper/80 sm:mt-7">{children}</div>
        )}
      </div>
    </section>
  )
}
