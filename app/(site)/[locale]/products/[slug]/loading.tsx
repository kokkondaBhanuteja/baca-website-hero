import { SiteHeader } from '@/components/layout/site-header'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailLoading() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-paper">
        {/* Hero placeholder */}
        <div className="flex min-h-[68svh] w-full items-end bg-bone">
          <div className="mx-auto w-full max-w-content px-5 pb-12 pt-header-base sm:px-8 sm:pb-16">
            <Skeleton className="mb-5 h-3 w-24" />
            <Skeleton className="h-12 w-3/4 max-w-xl" />
            <Skeleton className="mt-6 h-4 w-full max-w-md" />
          </div>
        </div>

        <section className="mx-auto max-w-[860px] px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
          <Skeleton className="h-3 w-28" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-4 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-12 flex gap-3">
            <Skeleton className="h-12 w-44 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </section>
      </main>
    </>
  )
}
