import Image from 'next/image'

import { FoundersNote } from '@/components/sections/founders-note'

const STATS = [
  {
    figure: '75%',
    label: 'of global spice production',
    source: 'Spices Board of India',
  },
  {
    figure: '2.5M+',
    label: 'farming families across India',
    source: 'Spices Board of India',
  },
  {
    figure: '180+',
    label: 'countries import Indian spices',
    source: 'Spices Board of India',
  },
]

const PRINCIPLES = [
  {
    n: '01',
    title: 'The Farmer First.',
    body: 'We pay above-market rates and open global doors for the families who grow our produce. Their stability is the foundation of our consistency.',
  },
  {
    n: '02',
    title: 'No Shortcuts, Ever.',
    body: 'Every batch is tested, documented, and verified at the farm, at processing, and before dispatch. If it does not meet our standard, it does not leave.',
  },
  {
    n: '03',
    title: 'Built for the Long Run.',
    body: 'We build partnerships, not transactions — with farmers behind us and buyers who trust us. Your trust is something we earn every shipment, not just the first.',
  },
]

export function BacaStory() {
  return (
    <section>
      {/* ── Block 1: Origin story + stats ── */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <p className="mb-8 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
            The BACA Story
          </p>

          <div className="grid grid-cols-1 gap-8 border-t border-ink/15 pt-8 lg:grid-cols-2 lg:gap-16">
            <h2 className="font-heading text-[2.6rem] font-light leading-[1.08] tracking-[0.01em] text-ink sm:text-[3.2rem] lg:text-[3.6rem]">
              India&apos;s finest origins,
              <br />
              <span className="text-ink/60">delivered with integrity.</span>
            </h2>

            <div className="flex flex-col justify-center gap-5">
              <p className="text-[1.05rem] leading-[1.9] text-ink">
                BACA was built on a single conviction: that the quality of what
                reaches a buyer is inseparable from the honesty of every step
                before it. We hold direct relationships with farming families
                across Kerala, Karnataka, Tamil Nadu, and Andhra Pradesh —
                offering fair pricing, transparent processes, and access to
                global markets that were once out of reach.
              </p>
              <p className="border-l-2 border-saffron pl-5 text-[1.05rem] italic leading-[1.8] text-ink">
                Because when the farmer thrives, everything that reaches you is
                better for it.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ink/15 pt-8">
            {STATS.map((stat, index) => (
              <div
                key={stat.figure}
                className={
                  index > 0 ? 'border-l border-ink/15 pl-4 sm:pl-8' : ''
                }
              >
                <p className="font-heading text-[2.2rem] font-light leading-none text-forest sm:text-[2.8rem]">
                  {stat.figure}
                </p>
                <p className="mt-2 text-[0.88rem] leading-[1.65] text-ink sm:text-[0.92rem]">
                  {stat.label}
                </p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink/60">
                  {stat.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Block 2: Vision & Mission (dark forest) ── */}
      <div className="bg-forest py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <div className="mb-10 flex items-center gap-6">
            <p className="font-mono text-[0.78rem] uppercase tracking-[0.35em] text-lime">
              Our Purpose
            </p>
            <div className="h-px flex-1 bg-paper/20" />
          </div>

          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
            <div className="border-b border-paper/20 pb-8 sm:border-b-0 sm:border-r sm:border-paper/20 sm:pb-0 sm:pr-10 lg:pr-16">
              <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-lime">
                Vision
              </p>
              <p className="font-heading text-[1.6rem] font-light leading-[1.55] text-paper sm:text-[1.8rem] lg:text-[2rem]">
                To be India&apos;s most trusted commodity exporter — known not
                for volume, but for the consistency that brings the same buyers
                back, season after season.
              </p>
            </div>

            <div className="pt-8 sm:pl-10 sm:pt-0 lg:pl-16">
              <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-lime">
                Mission
              </p>
              <p className="font-heading text-[1.6rem] font-light leading-[1.55] text-paper sm:text-[1.8rem] lg:text-[2rem]">
                To connect India&apos;s finest growing regions with the
                world&apos;s most discerning buyers — through traceable
                sourcing, honest quality, and a price that truly reflects the
                work behind every shipment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Block 3: Our Principles — numbered list left, sticky image right ── */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <p className="mb-8 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
            Our Principles
          </p>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-14 xl:grid-cols-[1fr_460px]">
            {/* Principles list */}
            <div className="divide-y divide-ink/10 border-t border-ink/10">
              {PRINCIPLES.map((item) => (
                <div
                  key={item.n}
                  className="group grid grid-cols-[4rem_1fr] gap-6 py-9 sm:gap-10"
                >
                  <div className="pt-1">
                    <span className="font-heading block text-[3.5rem] font-light leading-none text-forest/20 sm:text-[4rem]">
                      {item.n}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="font-heading text-[1.9rem] font-light leading-[1.1] text-ink transition-colors duration-300 group-hover:text-forest sm:text-[2.2rem]">
                      {item.title}
                    </h3>
                    <div className="h-px w-8 bg-ink/25 transition-colors duration-300 group-hover:bg-saffron" />
                    <p className="text-[1rem] leading-[1.85] text-ink sm:text-[1.05rem]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky image */}
            <div className="hidden lg:block">
              <div className="sticky top-[calc(var(--spacing-header-base)+2rem)]">
                <div className="relative overflow-hidden rounded-2xl">
                  <div className="relative h-[520px] w-full xl:h-[580px]">
                    <Image
                      src="/images/who-we-are.jpg"
                      alt="BACA — farmers and fields"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1280px) 400px, 460px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/80">
                        Direct from India&apos;s heartland
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Block 4: Founders voices ── */}
      <FoundersNote />
    </section>
  )
}
