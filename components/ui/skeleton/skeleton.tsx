import { cn } from '@/lib/utils'

/**
 * Neutral placeholder block used by `loading.tsx` files while a Server Component
 * streams. Matches the bone/cream surface palette and pulses gently. Pass any
 * Tailwind sizing classes via `className`.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-lg bg-bone', className)}
    />
  )
}
