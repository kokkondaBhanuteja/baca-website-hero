import { Reveal } from '@/components/reveal'

const PILLARS = [
  {
    n: '01',
    title: 'Sourcing',
    body: 'We buy directly from growers in origin regions — Kerala cardamom, Guntur chilli, Malabar pepper — for full traceability from farm to forwarder.',
  },
  {
    n: '02',
    title: 'Quality',
    body: 'Every lot is graded, lab-tested for moisture, pesticide residue and aflatoxins, and documented against ISO 22000 and HACCP protocols.',
  },
  {
    n: '03',
    title: 'Logistics',
    body: 'Packed at origin and shipped in documented full containers, with Incoterms, HS codes and certificates issued before vessels depart.',
  },
  {
    n: '04',
    title: 'Partnership',
    body: 'We hold fixed contracts and reserve harvests for repeat buyers — a relationship measured in years, not single shipments.',
  },
]

export function Approach() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="mb-4 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-60">
              <span className="h-px w-6 bg-saffron" aria-hidden />
              Our approach
            </p>
            <h2 className="text-balance font-heading text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
              The BACA Standard, in four moves.
            </h2>
          </Reveal>

          <ol className="lg:col-span-8">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} as="li" delay={i * 70}>
                <div className="grid grid-cols-[auto_1fr] items-start gap-6 border-t border-line py-8 sm:grid-cols-[7rem_1fr] sm:gap-10">
                  <span className="font-heading text-3xl font-light italic text-saffron sm:text-4xl">
                    {p.n}
                  </span>
                  <div className="max-w-[56ch]">
                    <h3 className="font-heading text-2xl font-light text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-60">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
