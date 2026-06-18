import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function CtaBand() {
  return (
    <section className="bg-forest text-paper">
      <div className="mx-auto max-w-[1080px] px-5 py-[clamp(4rem,8vw,7rem)] text-center sm:px-8">
        <Reveal>
          <p className="mb-6 flex items-center justify-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-paper/60">
            <span className="h-px w-6 bg-saffron" aria-hidden />
            Let&apos;s talk
          </p>
          <h2 className="mx-auto max-w-[20ch] text-balance font-heading text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.02em] text-paper">
            Let&apos;s build a reliable supply chain{' '}
            <span className="italic text-saffron">together.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-[15px] leading-relaxed text-paper/75">
            Tell us what you source and where it ships. We respond to
            international enquiries within 12 hours.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              Enquire now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
            >
              Download catalogue
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
