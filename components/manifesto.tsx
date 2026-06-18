import { Reveal } from '@/components/reveal'

export function Manifesto() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1080px] px-5 py-[clamp(4rem,8vw,8rem)] sm:px-8">
        <Reveal>
          <p className="mb-8 flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-60">
            <span className="h-px w-6 bg-saffron" aria-hidden />
            Who we are
          </p>
        </Reveal>
        <Reveal delay={80}>
          <p className="max-w-[24ch] text-balance font-heading text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.12] tracking-[-0.02em] text-ink sm:max-w-[20ch]">
            We connect Indian growers with the world&apos;s most demanding
            kitchens — sourcing{' '}
            <span className="italic text-saffron">with intention</span>, and
            shipping with precision.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
