'use client'

import { useId, useRef } from 'react'

import {
  WORDMARK_ALIGN_ANCHOR,
  WORDMARK_ALIGN_X,
  type WordmarkAlign,
} from '@/components/ui/wordmark-clip'
import { useWordmarkSlideshow } from './use-wordmark-slideshow'

interface WordmarkSlideshowProps {
  /** The word to render. Brand proper noun — not translated. */
  text?: string
  /** Ordered image sources for the montage. */
  images: string[]
  /** Horizontal placement of the letters (default 'center'). */
  align?: WordmarkAlign
  /** Sizing/spacing owned by the consumer (container width sets the overall scale). */
  className?: string
}

/**
 * "Tide Wash" wordmark montage — cinematic stills revealed inside the letterforms
 * by a GSAP-driven clip-path sweep (each new frame washes in left→right like an
 * incoming tide), with a slow Ken Burns push during each hold. Same SVG text-clip
 * technique as `WordmarkMedia`, but image-based and lighter than video.
 *
 * Decorative → aria-hidden, with a visually hidden real-text label. The loop pauses
 * while off-screen; under prefers-reduced-motion a single still shows, no motion.
 */
export function WordmarkSlideshow({
  text = 'BACA',
  images,
  align = 'center',
  className,
}: WordmarkSlideshowProps) {
  const rawId = useId()
  const clipId = `wordmark-slideshow-${rawId.replace(/[^a-zA-Z0-9-]/g, '')}`
  const rootRef = useRef<HTMLDivElement | null>(null)
  const imageRefs = useRef<HTMLImageElement[]>([])

  useWordmarkSlideshow(rootRef, imageRefs, images.length)

  return (
    <div ref={rootRef} className={className}>
      <span className="sr-only">{text}</span>
      <svg
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={clipId}>
            <text
              x={WORDMARK_ALIGN_X[align]}
              y="258"
              textAnchor={WORDMARK_ALIGN_ANCHOR[align]}
              fontFamily="var(--font-heading)"
              fontSize="370"
              fontWeight="600"
              letterSpacing="-12"
            >
              {text}
            </text>
          </clipPath>
        </defs>
        <foreignObject
          x="0"
          y="0"
          width="1000"
          height="320"
          clipPath={`url(#${clipId})`}
        >
          <div className="relative h-full w-full bg-ink">
            {images.map((src, index) => (
              <img
                key={src}
                ref={(element) => {
                  if (element) imageRefs.current[index] = element
                }}
                src={src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ))}
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}
