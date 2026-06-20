/**
 * Top strip of the footer: the localized taglines scrolling horizontally on the
 * shared `.baca-marquee` keyframe. Pure presentation — the parent footer reads the
 * localized items once and passes them down.
 */
export function FooterMarquee({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden border-b border-paper/12 py-6">
      <div className="baca-marquee flex w-max items-center gap-10 whitespace-nowrap font-heading text-[clamp(1.25rem,2.4vw,2rem)] font-light text-paper/85">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="flex items-center gap-10">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-saffron" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}
