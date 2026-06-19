'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-driven motion on NATIVE scroll (no smooth-scroll hijack — most
 * comfortable/familiar feel):
 *  - [data-parallax] elements drift subtly on scroll (desktop only).
 *  - [data-reveal] elements clip/mask-reveal as they enter the viewport.
 * Disabled under prefers-reduced-motion.
 */
export function ScrollFX() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]')
    const parallax = gsap.utils.toArray<HTMLElement>('[data-parallax]')

    if (reduce) {
      reveals.forEach((el) =>
        gsap.set(el, { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1 }),
      )
      return
    }

    const ctx = gsap.context(() => {
      // Mask / clip reveals
      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)', y: 28, opacity: 0 },
          {
            clipPath: 'inset(0 0 0% 0)',
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })

      // Parallax — desktop only, subtle drift
      if (window.innerWidth >= 1024) {
        parallax.forEach((el) => {
          const trigger = el.closest('section') ?? el
          gsap.fromTo(
            el,
            { yPercent: -4, scale: 1.1 },
            {
              yPercent: 4,
              scale: 1.1,
              ease: 'none',
              scrollTrigger: {
                trigger,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          )
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return null
}
