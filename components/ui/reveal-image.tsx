'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lusion / Dribbble-style image reveal: the frame unmasks with a clip-path wipe
 * while the photo inside settles from a slight scale-up — a cinematic entrance as
 * the element scrolls into view. Initial hidden state is set in CSS (.reveal-img)
 * so there's no flash; reduced motion shows the image immediately.
 */
export function RevealImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const wrap = useRef<HTMLDivElement | null>(null)
  const img = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const w = wrap.current
    const i = img.current
    if (!w || !i) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tl = gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 82%' } })
    tl.to(w, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut' })
      .to(i, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <div ref={wrap} className={`reveal-img overflow-hidden ${className}`}>
      <img
        ref={img}
        src={src}
        alt={alt}
        className="h-full w-full object-cover will-change-transform"
      />
    </div>
  )
}
