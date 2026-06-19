import { BadgeCheck } from 'lucide-react'
import { Reveal } from '@/components/reveal'

// The credentials an Indian spice/food exporter ships against.
const CERTS = [
  { name: 'FSSAI', sub: 'Central License' },
  { name: 'Spices Board', sub: 'RCMC · India' },
  { name: 'APEDA', sub: 'Export registration' },
  { name: 'ISO 22000', sub: 'Food safety mgmt' },
  { name: 'HACCP', sub: 'Hazard control' },
  { name: 'India Organic', sub: 'NPOP certified' },
  { name: 'Halal', sub: 'Market access' },
  { name: 'Kosher', sub: 'Market access' },
]

export function Certifications() {
  return (
    <section id="compliance" className="bg-cream">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p
              data-reveal
              className="mb-4 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-60"
            >
              <span className="h-px w-6 bg-saffron" aria-hidden />
              Certifications
            </p>
            <h2
              data-reveal
              className="max-w-[18ch] text-balance font-heading text-[clamp(1.9rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink"
            >
              Certified for global trade.
            </h2>
          </div>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink-60">
            Every container ships with its food-safety and export paperwork in
            order — registered, audited, and documented to the standard each market
            requires.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {CERTS.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className="flex items-center gap-3 border-t border-line pt-5">
                <BadgeCheck
                  className="h-8 w-8 shrink-0 text-saffron"
                  strokeWidth={1.4}
                  aria-hidden
                />
                <div>
                  <p className="font-heading text-lg font-light leading-tight text-ink">
                    {c.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-60">
                    {c.sub}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
