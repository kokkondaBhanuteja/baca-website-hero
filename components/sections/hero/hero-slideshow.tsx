'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const SLIDES = [
  {
    src: '/images/hero-spice.jpg',
    caption: 'Sourced at origin · India',
  },
  {
    src: '/images/who-we-are.jpg',
    caption: 'Direct from the farm',
  },
  {
    src: '/images/product-green-cardamom.jpg',
    caption: 'Green Cardamom · Kerala',
  },
  {
    src: '/images/product-malabar-black-pepper.jpg',
    caption: 'Malabar Black Pepper',
  },
  {
    src: '/images/product-turmeric-fingers.jpg',
    caption: 'Turmeric Fingers · Andhra Pradesh',
  },
]

const INTERVAL_MS = 4500
const FADE_MS = 700

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return
      setFading(true)
      setTimeout(() => {
        setCurrent(idx)
        setFading(false)
      }, FADE_MS / 2)
    },
    [current],
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % SLIDES.length
      goTo(next)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [current, goTo])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Slides */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity ease-in-out ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${FADE_MS}ms` }}
          aria-hidden={idx !== current}
        >
          <Image
            src={slide.src}
            alt={slide.caption}
            fill
            className="object-cover object-center"
            priority={idx === 0}
            sizes="50vw"
          />
        </div>
      ))}

      {/* Bottom gradient + caption */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/80 via-forest/30 to-transparent px-8 pb-8 pt-24">
        <p
          className={`font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/90 transition-opacity duration-300 ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {SLIDES[current].caption}
        </p>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`rounded-full transition-all duration-400 ${
              idx === current
                ? 'h-1.5 w-7 bg-white'
                : 'h-1.5 w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute right-8 top-8 font-mono text-[0.6rem] tracking-[0.2em] text-white/60">
        {String(current + 1).padStart(2, '0')} /{' '}
        {String(SLIDES.length).padStart(2, '0')}
      </div>
    </div>
  )
}
