'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Site-wide scroll experience (Awwwards-style, tasteful):
 *  - Lenis smooth-scroll synced to GSAP ScrollTrigger for a premium scroll feel.
 *  - [data-parallax] elements drift on scroll (depth) — held oversized so no edges show.
 *  - [data-reveal] elements clip/mask-reveal as they enter the viewport.
 * Fully disabled under prefers-reduced-motion (native scroll, content shown).
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

    // Parallax (kept scaled so the drift never reveals an edge)
    parallax.forEach((el) => {
      const trigger = el.closest('section') ?? el
      gsap.fromTo(
        el,
        { yPercent: -4, scale: 1.1 },
        {
          yPercent: 4,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })

    // Lenis smooth scroll, driven by the GSAP ticker
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return null
}
