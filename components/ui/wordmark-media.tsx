'use client'

import { useEffect, useId, useRef } from 'react'

import {
  WORDMARK_ALIGN_ANCHOR,
  WORDMARK_ALIGN_X,
  type WordmarkAlign,
} from '@/components/ui/wordmark-clip'

export interface WordmarkVideoSource {
  src: string
  type: string
}

interface WordmarkMediaProps {
  /** The word to render. Brand proper noun — not translated. */
  text?: string
  videoSources: WordmarkVideoSource[]
  posterSrc: string
  /** Horizontal placement of the letters (default 'center'). */
  align?: WordmarkAlign
  /** Sizing/spacing owned by the consumer (container width sets the overall scale). */
  className?: string
}

/**
 * A full-width wordmark whose letterforms reveal a looping video (every.com-style
 * "media inside text"). Responsive via an SVG viewBox; the HTML <video> lives in a
 * <foreignObject> clipped by an SVG <text> path.
 *
 * Fallbacks: the <video> shows its poster before/without playback. Under
 * prefers-reduced-motion or on small screens we do not autoplay, so the poster
 * still shows — never a blank box. Decorative → aria-hidden, with a visually
 * hidden real-text label for assistive tech. Off-screen → paused.
 */
export function WordmarkMedia({
  text = 'BACA',
  videoSources,
  posterSrc,
  align = 'center',
  className,
}: WordmarkMediaProps) {
  const rawId = useId()
  const clipId = `wordmark-clip-${rawId.replace(/[^a-zA-Z0-9-]/g, '')}`
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Playback is driven imperatively (no autoplay attribute) so the poster shows
  // first and we never start video under reduced-motion / on small screens.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const smallScreen = window.matchMedia('(max-width: 640px)').matches
    if (reduceMotion || smallScreen) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={className}>
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
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={posterSrc}
            muted
            loop
            playsInline
            preload="metadata"
          >
            {videoSources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        </foreignObject>
      </svg>
    </div>
  )
}
