import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink">
      {/* Full-bleed photograph */}
      <img
        src="/images/hero-spice.jpg"
        alt="A grid of assorted Indian spices in trays — turmeric, chilli, cumin, cinnamon and more"
        data-parallax
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Scrims for legibility — lighter so the image stays crisp */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1340px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
        {/* Eyebrow */}
        <p className="baca-reveal is-visible mb-6 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-paper/80">
          <span className="h-px w-6 bg-saffron" aria-hidden />
          Est. 2009 · Bharat Cargo
        </p>

        <div className="grid items-end gap-10 lg:grid-cols-12">
          {/* Headline */}
          <h1 className="baca-reveal is-visible col-span-12 max-w-[14ch] text-balance font-heading font-light leading-[0.98] tracking-[-0.035em] text-paper lg:col-span-7 text-[clamp(3rem,8.5vw,7.8rem)]">
            Sourced from Indian soil. Trusted across the{' '}
            <span className="italic text-saffron">world.</span>
          </h1>

          {/* Right column */}
          <div className="baca-reveal is-visible col-span-12 max-w-md lg:col-span-5 lg:justify-self-end">
            <p className="mb-3 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-paper/70">
              <span className="h-px w-6 bg-paper/40" aria-hidden />
              The BACA Standard
            </p>
            <p className="text-pretty text-[15px] leading-relaxed text-paper/85">
              A new generation of Indian export — built on traceable sourcing,
              rigorous quality, and partnerships that move commodities reliably,
              container after container.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/products"
                data-cursor="fill"
                className="group inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-clay hover:text-paper"
              >
                Explore products
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="/contact"
                data-cursor="fill"
                className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Talk to our team
              </a>
            </div>
          </div>
        </div>

        {/* Foot strip */}
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-paper/15 pt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper/65">
          <span className="flex items-center gap-2">
            Scroll
            <span className="inline-block h-px w-10 bg-paper/40" aria-hidden />
          </span>
          <span className="text-paper/30" aria-hidden>
            /
          </span>
          <span>37 Countries Served</span>
          <span className="text-paper/30" aria-hidden>
            /
          </span>
          <span>ISO 22000 · HACCP · FSSAI</span>
        </div>
      </div>
    </section>
  )
}
