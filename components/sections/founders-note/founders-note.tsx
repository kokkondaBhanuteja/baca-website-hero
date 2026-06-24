'use client'

import { useState } from 'react'

const FOUNDERS = [
  {
    initials: 'AM',
    name: 'Arjun Menon',
    role: 'Co-founder · Sourcing & Quality',
    note: 'My father used to say — never sell what you would not serve at your own table. That has been our rule since the very first shipment. I have walked the same fields in Kerala for over two decades, and I still visit before we commit to a grower. You cannot build real trust from a desk.',
  },
  {
    initials: 'PM',
    name: 'Priya Menon',
    role: 'Co-founder · Trade & Logistics',
    note: 'In this trade, a delayed document is a broken promise. When a container sits at port waiting on paperwork, it is not a logistics problem — it is a trust problem. Everything we built around documentation came from watching that happen once, and deciding it would never happen to our buyers.',
  },
  {
    initials: 'RN',
    name: 'Rajan Nair',
    role: 'Director · Quality & Grower Relations',
    note: 'India grows some of the finest spices in the world. The farmers I work with have spent their whole lives perfecting what they do. Our job is simply to make sure that effort reaches the buyer intact — honestly graded, honestly packed, honestly shipped. Nothing more, nothing less.',
  },
]

export function FoundersNote() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  function goTo(idx: number) {
    if (idx === active) return
    setFading(true)
    setTimeout(() => {
      setActive(idx)
      setFading(false)
    }, 220)
  }

  const founder = FOUNDERS[active]

  return (
    <div className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        <p className="mb-12 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
          From the Founders
        </p>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[280px_1fr] lg:gap-24">
          {/* Founder selector */}
          <div className="flex flex-row gap-4 lg:flex-col lg:gap-0 lg:divide-y lg:divide-ink/10 lg:border-y lg:border-ink/10">
            {FOUNDERS.map((f, idx) => (
              <button
                key={f.name}
                onClick={() => goTo(idx)}
                className={`group relative flex items-center gap-4 text-left transition-all duration-300 lg:py-7 ${
                  idx === active ? 'opacity-100' : 'opacity-30 hover:opacity-55'
                }`}
              >
                {/* Active bar */}
                <span
                  className={`absolute -left-6 hidden h-full w-[3px] rounded-r bg-saffron transition-opacity duration-300 lg:block ${
                    idx === active ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Avatar */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    idx === active
                      ? 'bg-forest text-paper'
                      : 'bg-ink/8 text-ink'
                  }`}
                >
                  <span className="font-heading text-[1rem] font-light leading-none">
                    {f.initials}
                  </span>
                </div>

                {/* Name + role — desktop only */}
                <div className="hidden lg:block">
                  <p className="font-heading text-[1.15rem] font-light text-ink">
                    {f.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink/70">
                    {f.role}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Quote panel */}
          <div
            className={`transition-opacity duration-[220ms] ${fading ? 'opacity-0' : 'opacity-100'}`}
          >
            <div
              className="font-heading -mb-4 text-[6rem] leading-none text-forest/15 sm:text-[8rem]"
              aria-hidden
            >
              &ldquo;
            </div>

            <blockquote className="font-heading text-[1.8rem] font-light italic leading-[1.7] text-ink sm:text-[2.2rem]">
              {founder.note}
            </blockquote>

            <div className="mt-10 flex items-center gap-5">
              <div className="h-px w-10 bg-saffron/60" />
              <div>
                <p className="font-heading text-[1.2rem] font-light text-ink">
                  {founder.name}
                </p>
                <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ink/70">
                  {founder.role}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              {FOUNDERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={`Founder ${idx + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    idx === active
                      ? 'w-8 bg-saffron'
                      : 'w-2 bg-ink/15 hover:bg-ink/35'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
