import { Reveal } from '@/components/reveal'

const REGIONS = [
  { value: '37', label: 'Countries served' },
  { value: '5', label: 'Continents shipped to' },
  { value: '90%', label: 'Repeat-buyer rate' },
  { value: '12h', label: 'Enquiry response time' },
]

export function GlobalPresence() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <img
        src="/images/global-port.jpg"
        alt=""
        aria-hidden
        data-parallax
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/35"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1340px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal className="max-w-[40ch]">
          <p className="mb-5 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-paper/60">
            <span className="h-px w-6 bg-saffron" aria-hidden />
            Global reach
          </p>
          <h2 className="text-balance font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-paper">
            From Indian ports to{' '}
            <span className="italic text-saffron">five continents.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-paper/70">
            BACA ships to importers, distributors and food manufacturers across
            North America, Europe, the Middle East, Southeast Asia and Africa —
            on documented, on-time contracts.
          </p>
        </Reveal>

        <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {REGIONS.map((r, i) => (
            <Reveal key={r.label} delay={i * 70}>
              <dt className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-light leading-none tracking-[-0.03em] text-paper">
                {r.value}
              </dt>
              <dd className="mt-4 border-t border-paper/15 pt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper/55">
                {r.label}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
