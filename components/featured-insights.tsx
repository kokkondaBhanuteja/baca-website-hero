import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const POSTS = [
  {
    category: 'Industry Insights',
    title: 'Global cardamom demand is reshaping the 2026 harvest',
    date: 'Mar 2026',
    image: '/images/insight-3.png',
    alt: 'Indian turmeric and spice field at harvest with farmers working',
    href: '/blogs/industry-insights/global-cardamom-demand-2026',
  },
  {
    category: 'Impact Stories',
    title: 'Inside a modern spice processing facility in Kerala',
    date: 'Feb 2026',
    image: '/images/insight-2.png',
    alt: 'Workers inspecting quality inside a clean modern spice processing facility',
    href: '/blogs/impact-stories/modern-processing-kerala',
  },
  {
    category: 'Industry Insights',
    title: 'Reading the sea: ocean freight trends for ingredient buyers',
    date: 'Jan 2026',
    image: '/images/insight-1.png',
    alt: 'Cargo container ship at sea during golden hour sunset',
    href: '/blogs/industry-insights/ocean-freight-trends-2026',
  },
]

export function FeaturedInsights() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1340px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-60">
              <span className="h-px w-6 bg-saffron" aria-hidden />
              Featured insights
            </p>
            <h2 className="max-w-[18ch] text-balance font-heading text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-ink">
              Notes from the spice and commodities trade.
            </h2>
          </div>
          <a
            href="/blogs"
            className="group inline-flex items-center gap-2 self-end font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
          >
            All articles
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <Reveal key={post.title} delay={i * 90}>
              <a href={post.href} className="group block">
                <div className="overflow-hidden rounded-2xl border border-line">
                  <img
                    src={post.image || '/placeholder.svg'}
                    alt={post.alt}
                    className="aspect-[16/11] w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span className="rounded-full border border-line px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-60">
                    {post.category}
                  </span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-60">
                    {post.date}
                  </span>
                </div>
                <h3 className="mt-4 max-w-[28ch] text-balance font-heading text-xl font-light leading-snug text-ink transition-colors group-hover:text-clay">
                  {post.title}
                </h3>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
