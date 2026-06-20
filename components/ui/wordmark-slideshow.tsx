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

/**
 * Wave-shaped clip-path states for the "liquid surge" reveal. The right edge is an
 * undulating crest; the base x sweeps left→right while the crest pattern flips at the
 * MID keyframe, so the edge ripples like water rather than sliding as a rigid line.
 * (All three share the same 7-point structure so GSAP can interpolate them.)
 */
const WAVE_HIDDEN =
  'polygon(0% 0%, -28% 0%, -36% 25%, -20% 50%, -36% 75%, -28% 100%, 0% 100%)'
const WAVE_MID =
  'polygon(0% 0%, 50% 0%, 58% 25%, 42% 50%, 58% 75%, 50% 100%, 0% 100%)'
const WAVE_SHOWN =
  'polygon(0% 0%, 128% 0%, 120% 25%, 136% 50%, 120% 75%, 128% 100%, 0% 100%)'

const HOLD_SECONDS = 3.2
const WASH_SECONDS = 1.9

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
      gsap.set(slides[0], {
        autoAlpha: 1,
        clipPath: 'none',
        scale: 1.04,
        filter: 'blur(0px)',
      })
      return
    }

    let timeline: gsap.core.Timeline | null = null

    const context = gsap.context(() => {
      // Every frame parks hidden. The timeline is PAUSED until the footer scrolls
      // into view, then it leads with the first frame's surge (the entry) before
      // holding for the timeout and cycling — so it animates in the moment you arrive.
      gsap.set(slides, {
        autoAlpha: 1,
        clipPath: WAVE_HIDDEN,
        scale: 1.2,
        xPercent: 4,
        filter: 'blur(8px)',
        zIndex: 0,
      })

      timeline = gsap.timeline({ repeat: -1, paused: true })

      slides.forEach((slide, index) => {
        const previous = slides[(index - 1 + slides.length) % slides.length]
        const surgeAt = '>'

        // Surge IN this frame — phase 1: wave rises to the mid crest, blur eases.
        timeline!.fromTo(
          slide,
          {
            clipPath: WAVE_HIDDEN,
            scale: 1.2,
            xPercent: 4,
            filter: 'blur(8px)',
            autoAlpha: 1,
            zIndex: 2,
          },
          {
            clipPath: WAVE_MID,
            scale: 1.12,
            xPercent: 1.5,
            filter: 'blur(3px)',
            duration: WASH_SECONDS * 0.55,
            ease: 'power1.in',
          },
          surgeAt,
        )
        // Surge — phase 2: crest flips, washes off the right edge; focus pulls sharp.
        timeline!.to(slide, {
          clipPath: WAVE_SHOWN,
          scale: 1.06,
          xPercent: 0,
          filter: 'blur(0px)',
          duration: WASH_SECONDS * 0.45,
          ease: 'power2.out',
        })
        // The previous frame dissolves beneath: scales up, blurs, and truly fades.
        timeline!.to(
          previous,
          {
            scale: 1.3,
            filter: 'blur(6px)',
            autoAlpha: 0,
            duration: WASH_SECONDS,
            ease: 'power2.in',
          },
          surgeAt,
        )
        // Settle: reset the previous frame to the hidden wave state, behind.
        timeline!.set(previous, {
          clipPath: WAVE_HIDDEN,
          scale: 1.2,
          xPercent: 4,
          filter: 'blur(8px)',
          autoAlpha: 1,
          zIndex: 0,
        })
        timeline!.set(slide, { zIndex: 1 })

        // Hold (timeout): slow cinematic Ken Burns push before the next surge.
        timeline!.to(slide, {
          scale: 1.18,
          xPercent: -2.5,
          duration: HOLD_SECONDS,
          ease: 'sine.inOut',
        })
      })
    }, rootRef)

    const root = rootRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!timeline) return
        if (entry.isIntersecting) timeline.play()
        else timeline.pause()
      },
      { threshold: 0.2 },
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
