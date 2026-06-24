'use client'

import { useId } from 'react'

import {
  WORDMARK_ALIGN_ANCHOR,
  WORDMARK_ALIGN_X,
  type WordmarkAlign,
} from '@/components/ui/wordmark-clip'

interface WordmarkMosaicProps {
  /** Word to render. Brand proper noun — not translated. */
  text?: string
  /** One image per vertical band, left→right (≈ one texture per letter). */
  images: string[]
  /** Horizontal placement of the letters (default 'center'). */
  align?: WordmarkAlign
  /** Render a fading mirror reflection beneath the letters. */
  reflection?: boolean
  /** Sizing/spacing owned by the consumer (container width sets the scale). */
  className?: string
}

/**
 * Oversized wordmark whose letters reveal a ROW of images — one texture per
 * letter (every.com-style "media inside text", mosaic variant). The HTML <img>s
 * live in a <foreignObject> clipped by an SVG <text> path, laid out as equal
 * flex bands so each letter sits over its own image. Optionally mirrored below
 * as a fading reflection. Decorative → aria-hidden, with a visually hidden
 * real-text label for assistive tech.
 */
export function WordmarkMosaic({
  text = 'BACA',
  images,
  align = 'center',
  reflection = false,
  className,
}: WordmarkMosaicProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9-]/g, '')

  // Rendered twice (main + reflection) with distinct clip ids so url(#id) never
  // collides across the two SVGs in the same document.
  const panel = (clipId: string) => (
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
        <div className="flex h-full w-full">
          {images.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              className="h-full min-w-0 flex-1 object-cover"
            />
          ))}
        </div>
      </foreignObject>
    </svg>
  )

  return (
    <div className={className}>
      <span className="sr-only">{text}</span>
      {panel(`wordmark-mosaic-${rawId}`)}
      {reflection && (
        <div
          aria-hidden="true"
          className="-mt-[12%] opacity-25 [-webkit-mask-image:linear-gradient(to_top,rgba(0,0,0,0.7),transparent_55%)] [mask-image:linear-gradient(to_top,rgba(0,0,0,0.7),transparent_55%)] [transform:scaleY(-1)]"
        >
          {panel(`wordmark-mosaic-reflection-${rawId}`)}
        </div>
      )}
    </div>
  )
}
