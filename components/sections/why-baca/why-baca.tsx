const DIFFERENTIATORS = [
  {
    n: '01',
    title: 'Full Traceability',
    body: 'Every lot is tied to a specific grower cooperative, harvest window, and lab result — auditable from your warehouse all the way back to the field.',
  },
  {
    n: '02',
    title: 'Lab-Tested Quality',
    body: 'ISO 22000 + HACCP-grade controls at origin: moisture, pesticide residue, aflatoxin, and microbiological tests — not random sampling at port.',
  },
  {
    n: '03',
    title: 'Reliable Logistics',
    body: 'Contracted vessel slots and seasoned forwarders mean your container arrives in the window we quoted — not "sometime that month."',
  },
  {
    n: '04',
    title: 'Long-Term Partnership',
    body: 'Fixed-price contracts and crop reservations for repeat buyers. We measure relationships in growing seasons, not single purchase order numbers.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'It starts at the farm.',
    body: 'Every order begins with a visit — not a phone call. We walk the fields, meet the growers, and record each lot at its source. When you ask where your spice came from, we can name the farm, the season, and the harvest.',
  },
  {
    n: '02',
    title: 'Tested by people who do not work for us.',
    body: 'Every lot goes to an independent, accredited laboratory — not our own facility. You receive the original test report: moisture, pesticide levels, aflatoxins — measured openly and shared without editing.',
  },
  {
    n: '03',
    title: 'What the certificate says is what arrives.',
    body: 'We sort and confirm every lot before packing begins — never after loading. The grade on your invoice is the grade in the bag, and the net weight is checked at the container door. Every single time.',
  },
  {
    n: '04',
    title: 'Paperwork ready before the vessel is booked.',
    body: 'We prepare every certificate and compliance document before the shipment moves. Your import team receives a clean container — not a queue of corrections to chase down at the port.',
  },
  {
    n: '05',
    title: 'One person answers for every shipment.',
    body: 'You will always have a named contact who knows your cargo, your route, and your timeline. For buyers who return each season, we reserve allocations and agree prices before the harvest opens.',
  },
]

const CERTS = [
  {
    name: 'FSSAI',
    authority: 'Central License',
    sub: 'Mandatory food-safety clearance for all Indian food exports.',
  },
  {
    name: 'Spices Board',
    authority: 'CRES · India',
    sub: 'Government registration for certified spice exporters.',
  },
  {
    name: 'APEDA',
    authority: 'Export Registration',
    sub: 'Agri & Processed Food Products Export Development Authority.',
  },
  {
    name: 'ISO 22000',
    authority: 'Food Safety Mgmt',
    sub: 'International standard for food-safety management systems.',
  },
  {
    name: 'HACCP',
    authority: 'Hazard Control Protocol',
    sub: 'Systematic preventive approach to biological and chemical hazards.',
  },
  {
    name: 'Halal',
    authority: 'Market Access Certification',
    sub: 'Enables trade to markets requiring halal-certified product.',
  },
]

const topSteps = STEPS.slice(0, 3)
const bottomSteps = STEPS.slice(3)

function Pillar({
  n,
  label,
  title,
  body,
  bordered,
}: {
  n: string
  label: string
  title: string
  body: string
  bordered: boolean
}) {
  return (
    <div
      className={`group relative flex flex-col py-8 sm:py-10 ${bordered ? 'sm:border-l sm:border-ink/12 sm:pl-8' : ''}`}
    >
      <div className="mb-5 h-[2px] w-full bg-ink/10 transition-colors duration-300 group-hover:bg-saffron" />

      <div className="mb-5 flex items-baseline gap-2">
        <span className="font-heading text-[3rem] font-light leading-none text-saffron">
          {n}
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-saffron/60">
          {label}
        </span>
      </div>

      <h3 className="font-heading mb-4 text-[1.5rem] font-light leading-[1.2] text-ink transition-colors duration-300 group-hover:text-saffron sm:text-[1.65rem]">
        {title}
      </h3>

      <div className="mb-4 h-px w-8 bg-ink/20 transition-colors duration-300 group-hover:bg-saffron/50" />

      <p className="text-[0.9rem] leading-[1.85] text-ink">{body}</p>
    </div>
  )
}

export function WhyBaca() {
  return (
    <section>
      {/* ── Block 1: Four differentiators — compact 4-col cards ── */}
      <div className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="mb-2 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
                Why BACA
              </p>
              <h2 className="font-heading text-[2.2rem] font-light leading-[1.08] text-ink sm:text-[2.6rem]">
                Four reasons importers stay with us.
              </h2>
            </div>
            <p className="text-[0.9rem] leading-[1.75] text-ink/70 sm:max-w-[18rem] sm:text-right">
              Procurement teams choose BACA when they want to stop firefighting
              and start planning.
            </p>
          </div>

          {/* 4 cards in a row — all on one line at lg+, 2×2 on sm, stacked on mobile */}
          <div className="grid grid-cols-1 gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map((item) => (
              <div
                key={item.n}
                className="group relative flex flex-col gap-3 bg-white px-6 pb-6 pt-7 transition-colors duration-300 hover:bg-cream"
              >
                {/* Saffron top accent */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-saffron" />

                <p className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-saffron">
                  {item.n}
                </p>
                <h3 className="font-heading text-[1.35rem] font-light leading-[1.18] text-ink transition-colors duration-300 group-hover:text-forest sm:text-[1.45rem]">
                  {item.title}
                </h3>
                <div className="h-px w-6 bg-ink/15 transition-colors duration-300 group-hover:bg-saffron/60" />
                <p className="text-[0.88rem] leading-[1.8] text-ink">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Block 2: How We Work — 3 + 2 centred grid (approach.tsx pattern) ── */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl border-t border-ink/12 px-5 sm:px-8">
          <div className="mb-12 pt-12">
            <p className="mb-3 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
              How We Work
            </p>
            <h2 className="font-heading max-w-3xl text-[2.4rem] font-light leading-[1.08] text-ink sm:text-[3rem]">
              A process you can hold us to.
            </h2>
          </div>

          {/* Row 1: steps 01 02 03 */}
          <div className="grid grid-cols-1 border-t border-ink/12 sm:grid-cols-3">
            {topSteps.map((step, idx) => (
              <Pillar
                key={step.n}
                n={step.n}
                label="Step"
                title={step.title}
                body={step.body}
                bordered={idx > 0}
              />
            ))}
          </div>

          {/* Row 2: steps 04 05 — centred in 6-col grid */}
          <div className="grid grid-cols-1 border-t border-ink/12 sm:grid-cols-6">
            {bottomSteps.map((step, idx) => (
              <div
                key={step.n}
                className={`sm:col-span-2 ${idx === 0 ? 'sm:col-start-2' : 'sm:border-l sm:border-ink/12 sm:pl-8'}`}
              >
                <Pillar
                  n={step.n}
                  label="Step"
                  title={step.title}
                  body={step.body}
                  bordered={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Block 3: Certifications ── */}
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl border-t border-ink/12 px-5 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 pt-12">
            <div>
              <p className="mb-2 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
                Certifications
              </p>
              <h2 className="font-heading text-[2rem] font-light leading-[1.06] text-ink sm:text-[2.4rem]">
                Certified for global trade.
              </h2>
            </div>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink/70">
              Every shipment leaves with its credentials in order.
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-ink/10 border border-ink/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {CERTS.map((cert) => (
              <div
                key={cert.name}
                className="group flex flex-col gap-3 px-6 py-8 transition-colors duration-300 hover:bg-cream"
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-saffron">
                  {cert.authority}
                </p>
                <h3 className="font-heading text-[1.6rem] font-light leading-none text-ink sm:text-[1.8rem]">
                  {cert.name}
                </h3>
                <div className="h-px w-6 bg-ink/15 transition-colors duration-300 group-hover:bg-saffron/60" />
                <p className="text-[0.78rem] leading-[1.6] text-ink">
                  {cert.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
