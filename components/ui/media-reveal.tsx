'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP image reveal: the frame unmasks with a clip-path wipe + fade as it scrolls
 * into view. The hidden initial state is set inline (no flash on load); reduced
 * motion shows the image immediately. Wrap an image container with this.
 */
export function MediaReveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.style.clipPath = 'none'
      element.style.opacity = '1'
      return
    }

    const tween = gsap.to(element, {
      clipPath: 'inset(0 0 0% 0)',
      opacity: 1,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 90%' },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden', className)}
      style={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
    >
      {children}
    </div>
  )
}
