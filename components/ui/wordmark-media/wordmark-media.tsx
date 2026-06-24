'use client'

import { type ReactNode, useEffect, useId, useRef } from 'react'

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
  /** Render a fading mirror reflection beneath the letters. */
  reflection?: boolean
  /** Sizing/spacing owned by the consumer (container width sets the overall scale). */
  className?: string
}

/**
 * A wordmark whose letterforms reveal a single looping video (every.com-style
 * "media inside text"). Responsive via an SVG viewBox; the HTML <video> lives in a
 * <foreignObject> clipped by an SVG <text> path. Optional fading mirror reflection
 * (the reflection uses the static poster, not a second <video>, so the clip is
 * decoded only once).
 *
 * Fallbacks: the <video> shows its poster before/without playback. Under
 * prefers-reduced-motion we do not autoplay, so the poster still shows — never
 * a blank box. Decorative → aria-hidden, with a visually hidden real-text label
 * for assistive tech. Off-screen → paused.
 */
export function WordmarkMedia({
  text = 'BACA',
  videoSources,
  posterSrc,
  align = 'center',
  reflection = false,
  className,
}: WordmarkMediaProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9-]/g, '')
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Native muted `autoPlay` (+ `playsInline` + `loop`) starts the loop on its own
  // across browsers — playback must NOT depend on JS hydration alone. This effect
  // is only a refinement: pause when scrolled off-screen, and honor reduced-motion
  // (where we pause so the poster shows instead of motion).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
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

  // The clipped SVG panel, parameterised by clip id + inner media (video or poster).
  const panel = (clipId: string, media: ReactNode) => (
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
        {media}
      </foreignObject>
    </svg>
  )

  return (
    <div className={className}>
      <span className="sr-only">{text}</span>
      {panel(
        `wordmark-clip-${rawId}`,
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          {videoSources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>,
      )}
      {reflection && (
        <div
          aria-hidden="true"
          className="-mt-[12%] opacity-20 [-webkit-mask-image:linear-gradient(to_top,rgba(0,0,0,0.7),transparent_55%)] [mask-image:linear-gradient(to_top,rgba(0,0,0,0.7),transparent_55%)] [transform:scaleY(-1)]"
        >
          {panel(
            `wordmark-clip-reflection-${rawId}`,
            <img
              src={posterSrc}
              alt=""
              className="h-full w-full object-cover"
            />,
          )}
        </div>
      )}
    </div>
  )
}
