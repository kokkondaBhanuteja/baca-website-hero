'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Plays the home ENTRY timeline once on mount:
 *   1. the site header (nav) slides down + fades in — visible from the first frame
 *   2. elements marked [data-hero-reveal] stagger up in source order
 * Honors prefers-reduced-motion (everything shown, no motion). Scoped to the hero,
 * so it only runs on the home route where the hero renders.
 */
export function HeroEntry({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const header = document.querySelector('header')
    const revealItems = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll('[data-hero-reveal]'),
    )

    if (reduce) {
      gsap.set(revealItems, { opacity: 1, y: 0 })
      return
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      if (header) {
        timeline.from(header, { yPercent: -100, opacity: 0, duration: 0.5 })
      }
      timeline.from(
        revealItems,
        { opacity: 0, y: 30, duration: 0.9, stagger: 0.12 },
        header ? '-=0.1' : 0,
      )
    })

    return () => context.revert()
  }, [])

  return <div ref={rootRef}>{children}</div>
}
