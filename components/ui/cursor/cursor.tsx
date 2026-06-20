'use client'

import { useEffect } from 'react'

/**
 * Magnetic cursor: a saffron dot tracks the pointer instantly; a ring trails with
 * easing and — over a button or a CTA tagged data-cursor="fill" — morphs to wrap
 * that element's box (matching size + radius) and fills it with a saffron tint
 * while the dot hides. Plain links get a subtle ring tint. Desktop fine-pointer
 * only; native cursor hidden while active.
 */
export function Cursor() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'baca-cursor-dot'
    ring.className = 'baca-cursor-ring'
    document.body.append(dot, ring)
    document.body.classList.add('baca-has-cursor')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    const ringState = { x: mx, y: my, width: 34, height: 34, radius: 17 }
    let target: HTMLElement | null = null

    const fillSel = 'button, [data-cursor="fill"]'
    const linkSel =
      'a, [role="button"], input, textarea, select, label, [data-cursor]'

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }
    const onOver = (e: MouseEvent) => {
      const fill = (e.target as Element)?.closest?.(
        fillSel,
      ) as HTMLElement | null
      if (fill) {
        target = fill
        ring.classList.add('is-filled')
      } else if ((e.target as Element)?.closest?.(linkSel)) {
        ring.classList.add('is-active')
      }
    }
    const onOut = (e: MouseEvent) => {
      // `mouseout` bubbles, so it fires when crossing between children of the
      // same target. Only clear our state when the pointer is moving OUTSIDE
      // the currently-tracked element (relatedTarget is where it's going to).
      const movingTo = e.relatedTarget as Element | null
      const fill = (e.target as Element)?.closest?.(
        fillSel,
      ) as HTMLElement | null
      if (fill && fill === target && (!movingTo || !fill.contains(movingTo))) {
        target = null
        ring.classList.remove('is-filled')
      }
      const link = (e.target as Element)?.closest?.(linkSel)
      if (link && (!movingTo || !link.contains(movingTo))) {
        ring.classList.remove('is-active')
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let raf = 0
    const loop = () => {
      let tx = mx,
        ty = my,
        tw = 34,
        th = 34,
        trad = 17
      if (target && document.contains(target)) {
        // wrap the button exactly — no extra halo, reuse its own shape
        const targetRect = target.getBoundingClientRect()
        tx = targetRect.left + targetRect.width / 2
        ty = targetRect.top + targetRect.height / 2
        tw = targetRect.width
        th = targetRect.height
        const cr = parseFloat(getComputedStyle(target).borderRadius) || 8
        trad = cr > 100 ? th / 2 : cr
      } else if (target) {
        target = null
        ring.classList.remove('is-filled')
      }
      const tp = reduce ? 1 : 0.25 // position trail
      const ts = reduce ? 1 : 0.5 // size/radius — faster expansion
      ringState.x = lerp(ringState.x, tx, tp)
      ringState.y = lerp(ringState.y, ty, tp)
      ringState.width = lerp(ringState.width, tw, ts)
      ringState.height = lerp(ringState.height, th, ts)
      ringState.radius = lerp(ringState.radius, trad, ts)
      ring.style.width = `${ringState.width}px`
      ring.style.height = `${ringState.height}px`
      ring.style.borderRadius = `${ringState.radius}px`
      ring.style.transform = `translate(${ringState.x}px, ${ringState.y}px) translate(-50%, -50%)`
      dot.style.opacity = target ? '0' : '1'
      raf = requestAnimationFrame(loop)
    }

    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      dot.remove()
      ring.remove()
      document.body.classList.remove('baca-has-cursor')
    }
  }, [])

  return null
}
