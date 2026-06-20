import { Eyebrow } from '@/components/ui/eyebrow'

/** The shared inner-page header: eyebrow + oversized H1 + optional intro. */
export function PageIntro({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow: string
  heading: string
  intro?: string
}) {
  return (
    <div>
      <Eyebrow className="mb-4 text-ink-60">{eyebrow}</Eyebrow>
      <h1 className="max-w-[20ch] text-balance font-heading text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.04] tracking-[-0.02em] text-ink">
        {heading}
      </h1>
      {intro && (
        <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-ink-60">
          {intro}
        </p>
      )}
    </div>
  )
}
