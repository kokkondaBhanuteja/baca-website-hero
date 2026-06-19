'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Hand-drawn horizontal drift (px) applied per pillar — irregular on purpose so
// the line reads as inked by hand, not ruled by a machine.
const WOBBLE = [-5, 8, -10, 4, -7, 6]
const BASE_X = -22 // spine lives in the gutter just left of the pillar list

/**
 * Hand-drawn saffron "soil-to-shipment" thread for the Approach section. A
 * Catmull-Rom spline weaves organically through the four pillars (irregular
 * left/right drift — never a straight line), drawing on as the section scrolls
 * with a glowing head dot riding the curve and nodes that light + grow when the
 * line reaches them. Scrubbed by GSAP ScrollTrigger; honors reduced motion.
 */
export function ApproachThread() {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const container = svg.parentElement as HTMLElement | null
    if (!container) return

    const draw = svg.querySelector<SVGPathElement>('path.draw')
    const track = svg.querySelector<SVGPathElement>('path.track')
    const head = svg.querySelector<SVGCircleElement>('circle.head')
    if (!draw || !track || !head) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let totalLen = 1

    // Catmull-Rom -> cubic bezier: a smooth, flowing curve through every point.
    const spline = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return ''
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i]
        const p1 = pts[i]
        const p2 = pts[i + 1]
        const p3 = pts[i + 2] ?? p2
        const c1x = p1.x + (p2.x - p0.x) / 6
        const c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6
        const c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
      }
      return d
    }

    const render = (p: number) => {
      draw.style.strokeDashoffset = String(1 - p)
      const pt = draw.getPointAtLength(p * totalLen)
      head.setAttribute('cx', pt.x.toFixed(1))
      head.setAttribute('cy', pt.y.toFixed(1))
      head.style.opacity = p > 0.002 && p < 0.999 ? '1' : '0'
      svg.querySelectorAll<SVGCircleElement>('circle.node').forEach((c) => {
        const cy = Number(c.getAttribute('cy') || 0)
        c.classList.toggle('lit', pt.y >= cy - 6)
      })
    }

    const measure = () => {
      const w = container.clientWidth
      const H = container.clientHeight
      svg.setAttribute('viewBox', `0 0 ${w} ${H}`)

      const crect = container.getBoundingClientRect()
      const marks = Array.from(
        container.querySelectorAll<HTMLElement>('[data-pillar-node]'),
      )
      const nodePts = marks.map((el, i) => {
        const r = el.getBoundingClientRect()
        return { x: BASE_X + WOBBLE[i % WOBBLE.length], y: r.top - crect.top + 16 }
      })

      // Align entry/exit x with the first/last node so the curve flows in and
      // out smoothly instead of hooking at the ends.
      const firstX = nodePts.length ? nodePts[0].x : BASE_X
      const lastX = nodePts.length ? nodePts[nodePts.length - 1].x : BASE_X
      const pts = [
        { x: firstX, y: 0 },
        ...nodePts,
        { x: lastX, y: H },
      ]
      const d = spline(pts)
      track.setAttribute('d', d)
      draw.setAttribute('d', d)
      totalLen = draw.getTotalLength()

      // place nodes exactly on the curve
      svg.querySelectorAll('circle.node').forEach((c) => c.remove())
      nodePts.forEach((np) => {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        c.setAttribute('class', 'node')
        c.setAttribute('cx', np.x.toFixed(1))
        c.setAttribute('cy', np.y.toFixed(1))
        c.setAttribute('r', '5')
        svg.insertBefore(c, head) // nodes under the head dot
      })

      const vh = window.innerHeight
      const rect = container.getBoundingClientRect()
      render(
        reduce
          ? 1
          : Math.min(1, Math.max(0, (vh * 0.82 - rect.top) / (H * 0.85))),
      )
    }

    measure()

    let st: ScrollTrigger | null = null
    if (!reduce) {
      st = ScrollTrigger.create({
        trigger: container,
        start: 'top 82%',
        end: 'bottom 65%',
        scrub: 0.6,
        onUpdate: (self) => render(self.progress),
      })
    } else {
      render(1)
    }

    const onResize = () => {
      measure()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)
    const ro = new ResizeObserver(() => measure())
    ro.observe(container)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      ro.disconnect()
      st?.kill()
    }
  }, [])

  return (
    <svg
      ref={ref}
      className="baca-thread pointer-events-none absolute inset-0 z-0"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path className="track" strokeWidth={2} d="" />
      <path
        className="draw"
        strokeWidth={3}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1}
        d=""
      />
      <circle className="head" cx={-22} cy={0} r={5} style={{ fill: 'var(--saffron)' }} />
    </svg>
  )
}
