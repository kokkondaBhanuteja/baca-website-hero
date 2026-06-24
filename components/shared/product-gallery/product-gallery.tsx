'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

/**
 * Product image carousel shown below the heading on the detail page. A
 * scroll-snap track (native swipe on touch) with prev/next arrows and dot
 * indicators. A single image renders without controls.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const t = useTranslations('productGallery')
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  if (images.length === 0) return null
  const multiple = images.length > 1

  function scrollToIndex(index: number) {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(index, images.length - 1))
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' })
  }

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    setActive(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <div>
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-line [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, index) => (
            <div key={src} className="w-full shrink-0 snap-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={
                  multiple ? t('imageOfAlt', { alt, index: index + 1 }) : alt
                }
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          ))}
        </div>

        {multiple && (
          <>
            <button
              type="button"
              onClick={() => scrollToIndex(active - 1)}
              disabled={active === 0}
              aria-label={t('previous')}
              className="absolute start-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-paper disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(active + 1)}
              disabled={active === images.length - 1}
              aria-label={t('next')}
              className="absolute end-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper/90 text-ink shadow-sm backdrop-blur transition-opacity hover:bg-paper disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {multiple && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={t('goToImage', { index: index + 1 })}
              aria-current={index === active}
              className={cn(
                'h-1.5 rounded-full transition-all',
                index === active
                  ? 'w-6 bg-ink'
                  : 'w-1.5 bg-line hover:bg-ink/40',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
