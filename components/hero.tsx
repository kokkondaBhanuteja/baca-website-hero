"use client"

import { useEffect, useRef, useState } from "react"

const PROOF = [
  { value: "12", label: "Years exporting" },
  { value: "23", label: "Countries shipped to" },
  { value: "9", label: "Sourcing regions" },
]

export function Hero() {
  const [offset, setOffset] = useState(0)
  const ticking = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      window.requestAnimationFrame(() => {
        setOffset(Math.min(window.scrollY, 600))
        ticking.current = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-espresso">
      {/* Full-bleed background photo with subtle parallax */}
      <div
        aria-hidden
        className="absolute inset-0 -top-16 will-change-transform"
        style={{ transform: `translateY(${offset * 0.25}px) scale(1.08)` }}
      >
        <img
          src="/images/hero-origin.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Espresso gradient scrim: heavy bottom-left, fading top-right */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top right, rgba(36,23,18,0.94) 0%, rgba(36,23,18,0.72) 32%, rgba(36,23,18,0.32) 62%, rgba(36,23,18,0.08) 100%)",
        }}
      />
      {/* Extra floor darkening for the proof bar */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to top, rgba(36,23,18,0.85), transparent)",
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Rotated vertical label up the right edge */}
      <span
        aria-hidden
        className="absolute right-5 top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-xs uppercase tracking-[0.4em] text-ivory/55 md:block"
      >
        Sourced at origin
      </span>

      {/* Content — bottom-left */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-28 sm:px-10 sm:pb-32">
          <div className="max-w-3xl">
            <p
              className="baca-rise mb-5 font-mono text-[0.7rem] uppercase tracking-[0.35em] text-saffron"
              style={{ animationDelay: "0.05s" }}
            >
              India-origin export house · Est. 2013
            </p>

            <h1
              className="baca-rise font-display font-semibold leading-[0.82] tracking-[-0.02em] text-ivory"
              style={{
                fontSize: "clamp(5rem, 19vw, 16rem)",
                animationDelay: "0.15s",
              }}
            >
              BACA
            </h1>

            <p
              className="baca-rise mt-3 font-display text-2xl font-medium italic text-ivory/90 sm:text-4xl"
              style={{ animationDelay: "0.3s" }}
            >
              India, in every shipment
            </p>

            <p
              className="baca-rise mt-6 max-w-xl text-pretty leading-relaxed text-ivory/75"
              style={{ animationDelay: "0.42s" }}
            >
              We buy direct from growers in Kerala, Kashmir and Gujarat — graded
              and packed at origin, shipped in documented full containers.
            </p>

            <div
              className="baca-rise mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "0.54s" }}
            >
              <a
                href="#products"
                className="inline-flex items-center rounded-full bg-terracotta px-8 py-3.5 text-sm font-medium text-ivory shadow-lg shadow-espresso/40 transition-transform hover:-translate-y-0.5"
              >
                Explore catalog
              </a>
              <a
                href="#about"
                className="inline-flex items-center rounded-full border border-ivory/40 px-8 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ivory/10"
              >
                See our origins
              </a>
            </div>
          </div>
        </div>

        {/* Translucent proof bar pinned to hero bottom */}
        <div className="border-t border-ivory/15 bg-espresso/40 backdrop-blur-md">
          <dl className="mx-auto flex w-full max-w-7xl flex-wrap items-end gap-x-12 gap-y-4 px-6 py-5 sm:px-10">
            {PROOF.map((item) => (
              <div key={item.label} className="flex items-baseline gap-3">
                <dt className="font-display text-3xl font-semibold leading-none text-ivory sm:text-4xl">
                  {item.value}
                </dt>
                <dd className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory/60">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
