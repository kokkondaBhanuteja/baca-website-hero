import type { ComponentProps } from 'react'
import { ArrowRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

/**
 * Marketing CTA pill variants. This is the public-site counterpart to the admin
 * `buttonVariants` (components/ui/button) — but rendered as the locale-aware `Link`
 * on marketing tokens (saffron / ink / paper, rounded-full) instead of a <button>.
 */
const ctaLinkVariants = cva(
  'group inline-flex items-center gap-2 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        // H. Costa primary button: deep-green pill (lime label set per-tone below).
        solid: 'bg-forest text-paper',
        outline: 'border',
      },
      // `tone` is the surface the pill sits on: `light` over paper, `dark` over
      // forest/ink. It drives hover + outline colours via compoundVariants below.
      tone: {
        light: '',
        dark: '',
      },
      size: {
        md: 'px-6 py-3 text-sm',
        lg: 'px-7 py-3.5 text-sm',
        block: 'w-full justify-center px-6 py-4 text-base',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        tone: 'light',
        // Deep-green pill with lime label on light surfaces (H. Costa primary).
        class: 'text-lime hover:bg-ink',
      },
      {
        variant: 'solid',
        tone: 'dark',
        // On a forest/green field a green pill vanishes — use the lime pop.
        class: 'bg-lime text-ink hover:bg-lime/90',
      },
      {
        variant: 'outline',
        tone: 'light',
        class: 'border-ink/25 text-ink hover:bg-ink hover:text-paper',
      },
      {
        variant: 'outline',
        tone: 'dark',
        class: 'border-paper/35 text-paper hover:bg-paper/10',
      },
    ],
    defaultVariants: { variant: 'solid', tone: 'light', size: 'md' },
  },
)

type CtaLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof ctaLinkVariants> & {
    /** Render a trailing ArrowRight that nudges on hover (RTL-mirrored for Arabic). */
    arrow?: boolean
  }

/**
 * The single marketing CTA pill used across the public site (hero, cta-band,
 * 404, mobile menu). Wraps the i18n `Link`, tags itself `data-cursor="fill"` so
 * the global magnetic Cursor still targets it, and optionally renders a trailing
 * arrow with RTL-aware motion.
 */
export function CtaLink({
  variant,
  tone,
  size,
  arrow = false,
  className,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <Link
      data-cursor="fill"
      className={cn(ctaLinkVariants({ variant, tone, size }), className)}
      {...props}
    >
      {children}
      {arrow ? (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          aria-hidden
        />
      ) : null}
    </Link>
  )
}

export { ctaLinkVariants }
