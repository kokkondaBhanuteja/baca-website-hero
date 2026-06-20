'use client'

import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'

/**
 * Wave-shaped clip-path states for the "liquid surge" reveal. The right edge is an
 * undulating crest; the base x sweeps left→right while the crest pattern flips at
 * the MID keyframe, so the edge ripples like water rather than sliding as a rigid
 * line. (All three share the same 7-point structure so GSAP can interpolate them.)
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
 * "Tide Wash" timeline driver — owns the GSAP setup, intersection observer that
 * pauses the loop off-screen, and the reduced-motion fallback (single still, no
 * motion). The rendering component (`WordmarkSlideshow`) supplies the root ref
 * and the per-image refs; the hook does the rest.
 */
export function useWordmarkSlideshow(
  rootRef: RefObject<HTMLDivElement | null>,
  imageRefs: RefObject<HTMLImageElement[]>,
  imageCount: number,
) {
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
    // The hook re-runs when the image count changes; refs are stable identities.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageCount])
}
