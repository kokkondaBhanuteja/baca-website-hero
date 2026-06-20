'use client'

import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'

export interface LetterVideo {
  sources: { src: string; type: string }[]
  poster: string
}

interface WordmarkLettersProps {
  /** The word to render. Brand proper noun — not translated. */
  text?: string
  /** One image per letter (cycled). Used when `videos` is not provided. */
  images?: string[]
  /** One video per letter (cycled). Takes precedence over `images`. */
  videos?: LetterVideo[]
  className?: string
}

const ENTRY_STAGGER = 0.16

/**
 * Renders the wordmark with ONE media per letter — each glyph is its own
 * image/video window (SVG single-letter clip over a full media, so it reads
 * clearly). On scroll-into-view the letters reveal in a staggered wipe-up; still
 * images get a slow Ken Burns drift, videos play (paused off-screen, and on
 * small screens / reduced-motion they hold their poster frame). Decorative →
 * aria-hidden, with a visually hidden real-text label.
 */
export function WordmarkLetters({
  text = 'BACA',
  images = [],
  videos,
  className,
}: WordmarkLettersProps) {
  const baseId = useId().replace(/[^a-zA-Z0-9-]/g, '')
  const rootRef = useRef<HTMLDivElement | null>(null)
  const letters = text.split('')
  const useVideo = Boolean(videos && videos.length > 0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const panels = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-letter]'),
    )
    if (panels.length === 0) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallScreen = window.matchMedia('(max-width: 640px)').matches
    const letterImages = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-letter-img]'),
    )
    const letterVideos = Array.from(root.querySelectorAll('video'))

    if (reduce) return

    const context = gsap.context(() => {
      gsap.set(panels, {
        autoAlpha: 0,
        yPercent: 26,
        clipPath: 'inset(100% 0% 0% 0%)',
      })

      // Slow Ken Burns drift on still images only (videos move on their own).
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
            if (!smallScreen) {
              letterVideos.forEach((video) => void video.play().catch(() => {}))
            }
          } else {
            letterVideos.forEach((video) => video.pause())
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
          const video = useVideo ? videos![index % videos!.length] : null
          const imageSrc = images[index % images.length]
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
                  {video ? (
                    <video
                      className="h-full w-full object-cover"
                      poster={video.poster}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    >
                      {video.sources.map((source) => (
                        <source
                          key={source.src}
                          src={source.src}
                          type={source.type}
                        />
                      ))}
                    </video>
                  ) : (
                    <img
                      data-letter-img
                      src={imageSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </foreignObject>
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}
