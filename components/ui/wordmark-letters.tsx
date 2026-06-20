'use client'

import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

interface WordmarkLettersProps {
  /** The word to render. Brand proper noun — not translated. */
  text?: string
  /** One image per letter (cycled if there are fewer images than letters). */
  images: string[]
  className?: string
}

const ENTRY_STAGGER = 0.16

/**
 * Renders the wordmark with ONE image per letter — each glyph is its own
 * image-window (SVG single-letter clip over a full image, so the image reads
 * clearly). On scroll-into-view the letters reveal in a staggered wipe-up, and
 * each image keeps a slow Ken Burns drift. Decorative → aria-hidden, with a
 * visually hidden real-text label. Reduced-motion → letters shown, no motion.
 */
export function WordmarkLetters({
  text = 'BACA',
  images,
  className,
}: WordmarkLettersProps) {
  const baseId = useId().replace(/[^a-zA-Z0-9-]/g, '')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const letters = text.split('')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const panels = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-letter]'),
    )
    const letterImages = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-letter-img]'),
    )
    if (panels.length === 0) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const context = gsap.context(() => {
      gsap.set(panels, {
        autoAlpha: 0,
        yPercent: 26,
        clipPath: 'inset(100% 0% 0% 0%)',
      })

      // Each letter's image keeps a slow, independent Ken Burns drift.
      letterImages.forEach((image, index) => {
        gsap.to(image, {
          scale: 1.14,
          duration: 7 + index * 1.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })

      const reveal = gsap.timeline({ paused: true })
      reveal.to(panels, {
        autoAlpha: 1,
        yPercent: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: 'power3.out',
        stagger: ENTRY_STAGGER,
      })

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            reveal.play()
            observer.disconnect()
          }
        },
        { threshold: 0.25 },
      )
      observer.observe(root)
    }, root)

    return () => context.revert()
  }, [text])

  return (
    <div ref={rootRef} className={className}>
      <span className="sr-only">{text}</span>
      <div
        className="flex w-full items-end justify-center gap-1 sm:gap-2"
        aria-hidden="true"
      >
        {letters.map((char, index) => {
          const clipId = `wordmark-letter-${baseId}-${index}`
          const src = images[index % images.length]
          return (
            <div key={index} data-letter className="relative w-full flex-1">
              <svg
                viewBox="0 0 88 132"
                preserveAspectRatio="xMidYMid meet"
                className="w-full"
              >
                <defs>
                  <clipPath id={clipId}>
                    <text
                      x="44"
                      y="113"
                      textAnchor="middle"
                      fontFamily="var(--font-heading)"
                      fontSize="132"
                      fontWeight="600"
                    >
                      {char}
                    </text>
                  </clipPath>
                </defs>
                <foreignObject
                  x="0"
                  y="0"
                  width="88"
                  height="132"
                  clipPath={`url(#${clipId})`}
                >
                  <img
                    data-letter-img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </foreignObject>
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}
