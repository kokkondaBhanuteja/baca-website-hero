import { getTranslations } from 'next-intl/server'

const DIFFERENTIATOR_KEYS = [
  'traceability',
  'quality',
  'logistics',
  'partnership',
] as const

const STEP_KEYS = [
  'farm',
  'lab',
  'certificate',
  'paperwork',
  'contact',
] as const

const CERT_KEYS = [
  'fssai',
  'spicesBoard',
  'apeda',
  'iso22000',
  'haccp',
  'halal',
] as const

function Pillar({
  number,
  label,
  title,
  body,
  bordered,
}: {
  number: string
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
          {number}
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

export async function WhyBaca() {
  const t = await getTranslations('whyBaca')
  const stepLabel = t('process.stepLabel')

  const steps = STEP_KEYS.map((stepKey, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: t(`process.items.${stepKey}.title` as Parameters<typeof t>[0]),
    body: t(`process.items.${stepKey}.body` as Parameters<typeof t>[0]),
  }))
  const topSteps = steps.slice(0, 3)
  const bottomSteps = steps.slice(3)

  return (
    <section>
      {/* ── Block 1: Four differentiators — compact 4-col cards ── */}
      <div className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="mb-2 font-mono text-[0.78rem] uppercase tracking-[0.35em] text-ink">
                {t('differentiators.eyebrow')}
              </p>
              <h2 className="font-heading text-[2.2rem] font-light leading-[1.08] text-ink sm:text-[2.6rem]">
                {t('differentiators.heading')}
              </h2>
            </div>
            <p className="text-[0.9rem] leading-[1.75] text-ink/70 sm:max-w-[18rem] sm:text-right">
              {t('differentiators.intro')}
            </p>
          </div>

          {/* 4 cards in a row — all on one line at lg+, 2×2 on sm, stacked on mobile */}
          <div className="grid grid-cols-1 gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATOR_KEYS.map((differentiatorKey, index) => (
              <div
                key={differentiatorKey}
                className="group relative flex flex-col gap-3 bg-white px-6 pb-6 pt-7 transition-colors duration-300 hover:bg-cream"
              >
                {/* Saffron top accent */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-saffron" />

                <p className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-saffron">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-heading text-[1.35rem] font-light leading-[1.18] text-ink transition-colors duration-300 group-hover:text-forest sm:text-[1.45rem]">
                  {t(
                    `differentiators.items.${differentiatorKey}.title` as Parameters<
                      typeof t
                    >[0],
                  )}
                </h3>
                <div className="h-px w-6 bg-ink/15 transition-colors duration-300 group-hover:bg-saffron/60" />
                <p className="text-[0.88rem] leading-[1.8] text-ink">
                  {t(
                    `differentiators.items.${differentiatorKey}.body` as Parameters<
                      typeof t
                    >[0],
                  )}
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
              {t('process.eyebrow')}
            </p>
            <h2 className="font-heading max-w-3xl text-[2.4rem] font-light leading-[1.08] text-ink sm:text-[3rem]">
              {t('process.heading')}
            </h2>
          </div>

          {/* Row 1: steps 01 02 03 */}
          <div className="grid grid-cols-1 border-t border-ink/12 sm:grid-cols-3">
            {topSteps.map((step, index) => (
              <Pillar
                key={step.number}
                number={step.number}
                label={stepLabel}
                title={step.title}
                body={step.body}
                bordered={index > 0}
              />
            ))}
          </div>

          {/* Row 2: steps 04 05 — centred in 6-col grid */}
          <div className="grid grid-cols-1 border-t border-ink/12 sm:grid-cols-6">
            {bottomSteps.map((step, index) => (
              <div
                key={step.number}
                className={`sm:col-span-2 ${index === 0 ? 'sm:col-start-2' : 'sm:border-l sm:border-ink/12 sm:pl-8'}`}
              >
                <Pillar
                  number={step.number}
                  label={stepLabel}
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
                {t('certifications.eyebrow')}
              </p>
              <h2 className="font-heading text-[2rem] font-light leading-[1.06] text-ink sm:text-[2.4rem]">
                {t('certifications.heading')}
              </h2>
            </div>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink/70">
              {t('certifications.intro')}
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-ink/10 border border-ink/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            {CERT_KEYS.map((certKey) => (
              <div
                key={certKey}
                className="group flex flex-col gap-3 px-6 py-8 transition-colors duration-300 hover:bg-cream"
              >
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-saffron">
                  {t(
                    `certifications.items.${certKey}.authority` as Parameters<
                      typeof t
                    >[0],
                  )}
                </p>
                <h3 className="font-heading text-[1.6rem] font-light leading-none text-ink sm:text-[1.8rem]">
                  {t(
                    `certifications.items.${certKey}.name` as Parameters<
                      typeof t
                    >[0],
                  )}
                </h3>
                <div className="h-px w-6 bg-ink/15 transition-colors duration-300 group-hover:bg-saffron/60" />
                <p className="text-[0.78rem] leading-[1.6] text-ink">
                  {t(
                    `certifications.items.${certKey}.sub` as Parameters<
                      typeof t
                    >[0],
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
