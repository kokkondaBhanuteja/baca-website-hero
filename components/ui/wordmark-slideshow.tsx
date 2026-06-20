'use client'

import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

import {
  WORDMARK_ALIGN_ANCHOR,
  WORDMARK_ALIGN_X,
  type WordmarkAlign,
} from '@/components/ui/wordmark-clip'

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

/** clip-path states for the left→right "tide wash" reveal. */
const CLIP_HIDDEN = 'inset(0% 100% 0% 0%)' // clipped from the right — nothing shown
const CLIP_SHOWN = 'inset(0% 0% 0% 0%)' // fully revealed

const HOLD_SECONDS = 3.4
const WASH_SECONDS = 1.6

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

  useEffect(() => {
    const slides = imageRefs.current.filter(Boolean)
    if (slides.length === 0) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion || slides.length === 1) {
      gsap.set(slides, { autoAlpha: 0 })
      gsap.set(slides[0], { autoAlpha: 1, clipPath: CLIP_SHOWN, scale: 1.04 })
      return
    }

    let timeline: gsap.core.Timeline | null = null

    const context = gsap.context(() => {
      gsap.set(slides, {
        autoAlpha: 1,
        clipPath: CLIP_HIDDEN,
        scale: 1.1,
        xPercent: 0,
        zIndex: 0,
      })
      gsap.set(slides[0], { clipPath: CLIP_SHOWN, scale: 1.06, zIndex: 1 })

      timeline = gsap.timeline({ repeat: -1 })

      slides.forEach((slide, index) => {
        const incoming = slides[(index + 1) % slides.length]
        // Hold: slow cinematic push on the current frame.
        timeline!.to(slide, {
          scale: 1.16,
          xPercent: -2,
          duration: HOLD_SECONDS,
          ease: 'sine.inOut',
        })
        // Wash: the next frame sweeps in left→right, easing from over-scale + drift.
        timeline!.fromTo(
          incoming,
          { clipPath: CLIP_HIDDEN, scale: 1.12, xPercent: 3, zIndex: 2 },
          {
            clipPath: CLIP_SHOWN,
            scale: 1.06,
            xPercent: 0,
            duration: WASH_SECONDS,
            ease: 'power3.inOut',
          },
        )
        // Settle: drop the outgoing frame behind and reset it for the next cycle.
        timeline!.set(slide, {
          clipPath: CLIP_HIDDEN,
          scale: 1.1,
          xPercent: 0,
          zIndex: 0,
        })
        timeline!.set(incoming, { zIndex: 1 })
      })
    }, rootRef)

    const root = rootRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!timeline) return
        if (entry.isIntersecting) timeline.play()
        else timeline.pause()
      },
      { threshold: 0.1 },
    )
    if (root) observer.observe(root)

    return () => {
      observer.disconnect()
      context.revert()
    }
  }, [images.length])

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
