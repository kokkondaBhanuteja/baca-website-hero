import { Eyebrow } from '@/components/ui/eyebrow'

/** The shared inner-page header: eyebrow + oversized H1 + optional intro. */
export function PageIntro({
  eyebrow,
  heading,
  subheading,
  intro,
  headingClassName,
}: {
  eyebrow: string
  heading: string
  subheading?: string
  intro?: string
  headingClassName?: string
}) {
  return (
    <div>
      <Eyebrow className="mb-4 text-ink-60">{eyebrow}</Eyebrow>
      <h1
        className={`max-w-[20ch] text-balance font-heading text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.04] tracking-[-0.02em] text-ink ${headingClassName ?? ''}`}
      >
        {heading}
      </h1>
      {subheading && (
        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-ink-60">
          {subheading}
        </p>
      )}
      {intro && (
        <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-ink-60">
          {intro}
        </p>
      )}
    </div>
  )
}
