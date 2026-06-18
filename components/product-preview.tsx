import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const CATEGORIES = [
  {
    title: 'Spices',
    href: '/products/spices',
    image: '/images/cat-spices.png',
    alt: 'Mounds of vivid Indian spices — turmeric, dried chillies, pepper and cardamom',
    note: 'Cardamom · Pepper · Turmeric · Cumin · Chilli',
  },
  {
    title: 'Nuts',
    href: '/products/nuts',
    image: '/images/cat-nuts.png',
    alt: 'Premium whole white cashew kernels with peanuts and almonds in a rustic bowl',
    note: 'Cashew W180–W450 · Peanuts · Almonds',
  },
  {
    title: 'Fruits',
    href: '/products/fruits',
    image: '/images/cat-fruits.png',
    alt: 'Ripe Alphonso mangoes sliced to show golden flesh, with pomegranate and grapes',
    note: 'Alphonso · Kesar · Pomegranate · Grapes',
  },
]

export function ProductPreview() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-60">
              <span className="h-px w-6 bg-saffron" aria-hidden />
              What we export
            </p>
            <h2 className="max-w-[16ch] text-balance font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
              Three categories, sourced at origin.
            </h2>
          </div>
          <a
            href="/products"
            className="group inline-flex items-center gap-2 self-end font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
          >
            View all categories
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 90}>
              <a
                href={cat.href}
                className="group block overflow-hidden rounded-2xl border border-line bg-paper"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={cat.image || '/placeholder.svg'}
                    alt={cat.alt}
                    className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink transition-colors group-hover:bg-saffron">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-5">
                  <div>
                    <h3 className="font-heading text-2xl font-light text-ink">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-60">
                      {cat.note}
                    </p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
