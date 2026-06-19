import { cn } from '@/lib/utils'

/**
 * The repeated section "eyebrow": a short saffron rule followed by a mono,
 * upper-cased micro-label. Color/margin/alignment come via `className`; extra
 * props (e.g. `data-reveal`) pass straight through to the `<p>`.
 */
export function Eyebrow({
  children,
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em]',
        className,
      )}
      {...props}
    >
      <span className="h-px w-6 bg-saffron" aria-hidden />
      {children}
    </p>
  )
}
