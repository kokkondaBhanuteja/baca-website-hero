import { Reveal } from '@/components/reveal'
import { RevealImage } from '@/components/reveal-image'

export function Manifesto() {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[1340px] items-center gap-12 px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="mb-8 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-60">
              <span className="h-px w-6 bg-saffron" aria-hidden />
              Our story
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-[22ch] text-balance font-heading text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.12] tracking-[-0.02em] text-ink">
              We connect Indian growers with the world&apos;s most demanding
              kitchens — sourcing{' '}
              <span className="italic text-saffron">with intention</span>, and
              shipping with precision.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-[46ch] text-[15px] leading-relaxed text-ink-60">
              Two decades at origin in Kerala, Gujarat and Andhra — buying from the
              same farming families season after season, grading at source, and
              moving full containers to buyers across 37 countries.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <RevealImage
            src="/images/who-we-are.jpg"
            alt="Weathered hands slicing fresh turmeric at source in India — grading raw spice the way BACA's farming families have for generations"
            className="aspect-[4/5] w-full rounded-2xl border border-line"
          />
        </div>
      </div>
    </section>
  )
}
