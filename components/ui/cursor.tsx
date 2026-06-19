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
    const r = { x: mx, y: my, w: 34, h: 34, rad: 17 }
    let target: HTMLElement | null = null

    const fillSel = 'button, [data-cursor="fill"]'
    const linkSel = 'a, [role="button"], input, textarea, select, label, [data-cursor]'

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
    }
    const onOver = (e: MouseEvent) => {
      const fill = (e.target as Element)?.closest?.(fillSel) as HTMLElement | null
      if (fill) {
        target = fill
        ring.classList.add('is-filled')
      } else if ((e.target as Element)?.closest?.(linkSel)) {
        ring.classList.add('is-active')
      }
    }
    const onOut = (e: MouseEvent) => {
      const fill = (e.target as Element)?.closest?.(fillSel)
      if (fill && fill === target) {
        target = null
        ring.classList.remove('is-filled')
      }
      if ((e.target as Element)?.closest?.(linkSel)) ring.classList.remove('is-active')
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let raf = 0
    const loop = () => {
      let tx = mx, ty = my, tw = 34, th = 34, trad = 17
      if (target && document.contains(target)) {
        // wrap the button exactly — no extra halo, reuse its own shape
        const b = target.getBoundingClientRect()
        tx = b.left + b.width / 2
        ty = b.top + b.height / 2
        tw = b.width
        th = b.height
        const cr = parseFloat(getComputedStyle(target).borderRadius) || 8
        trad = cr > 100 ? th / 2 : cr
      } else if (target) {
        target = null
        ring.classList.remove('is-filled')
      }
      const tp = reduce ? 1 : 0.25 // position trail
      const ts = reduce ? 1 : 0.50 // size/radius — faster expansion
      r.x = lerp(r.x, tx, tp)
      r.y = lerp(r.y, ty, tp)
      r.w = lerp(r.w, tw, ts)
      r.h = lerp(r.h, th, ts)
      r.rad = lerp(r.rad, trad, ts)
      ring.style.width = `${r.w}px`
      ring.style.height = `${r.h}px`
      ring.style.borderRadius = `${r.rad}px`
      ring.style.transform = `translate(${r.x}px, ${r.y}px) translate(-50%, -50%)`
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
