import { Skeleton } from '@/components/ui/skeleton'

/**
 * Generic loading skeleton for every admin dashboard page. One file covers
 * products / categories / blog-articles / enquiries (table-shaped) AND gallery
 * (grid-shaped) AND the dashboard root (count-cards). All admin pages share the
 * same top shape (heading + new button + body), so the placeholder leans on that.
 */
export function AdminListSkeleton({
  rows = 6,
  withNewButton = true,
}: {
  rows?: number
  withNewButton?: boolean
}) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        {withNewButton && <Skeleton className="h-10 w-36 rounded-full" />}
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-paper">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-5 border-b border-line px-5 py-4 last:border-0"
          >
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/6" />
            <Skeleton className="h-3 w-1/8" />
            <Skeleton className="ms-auto h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
