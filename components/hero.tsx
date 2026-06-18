const STATS = [
  { value: "12", label: "Years exporting" },
  { value: "23", label: "Countries shipped to" },
  { value: "9", label: "Sourcing regions" },
]

export function Hero() {
  return (
    <section className="px-4 pb-8 pt-4 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-line bg-bg-raised">
        {/* hairline strip across the top */}
        <div className="h-px w-full bg-line" />

        <div className="grid items-stretch gap-8 p-6 sm:p-10 lg:grid-cols-[55fr_45fr] lg:gap-10 lg:p-14">
          {/* LEFT */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.2em] text-ink-soft">
                India-origin export house · spices, nuts, fruits
              </p>

              <h1 className="font-display text-[clamp(3.5rem,12vw,9rem)] font-semibold leading-[0.9] tracking-tight text-ink">
                BACA
              </h1>

              <p className="mt-5 max-w-md text-balance font-display text-2xl font-medium leading-snug text-ink-soft sm:text-3xl">
                India, in every shipment
              </p>

              <p className="mt-5 max-w-md text-pretty leading-relaxed text-ink-soft">
                We buy direct from growers in Kerala, Kashmir, and Gujarat,
                grade and pack at origin, and ship full containers of cardamom,
                cashews, and dried fruit on documented lots.
              </p>

              <a
                href="#products"
                className="mt-8 inline-flex w-fit items-center rounded-full bg-terracotta px-7 py-3 text-sm font-medium text-bg-raised transition-opacity hover:opacity-90"
              >
                Explore catalog
              </a>
            </div>

            {/* stats row */}
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="font-display text-2xl font-semibold text-ink">
                    {stat.value}
                  </dt>
                  <dd className="text-xs uppercase tracking-wide text-ink-soft">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* RIGHT — India map placeholder */}
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-line bg-bg-base lg:min-h-full">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, var(--color-line) 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full border border-line bg-bg-raised/70 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-ink-soft backdrop-blur-sm">
                India map
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
