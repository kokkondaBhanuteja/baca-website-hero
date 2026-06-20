import { ArrowUpRight } from 'lucide-react'

import { Link } from '@/i18n/navigation'

/** Underlined-on-hover link primitive shared by every footer column. */
export function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group/link relative inline-flex w-fit items-center gap-1.5 text-[14px] text-paper/65 transition-colors hover:text-paper"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 start-0 h-px w-0 bg-saffron transition-all duration-300 group-hover/link:w-full" />
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
    </Link>
  )
}
