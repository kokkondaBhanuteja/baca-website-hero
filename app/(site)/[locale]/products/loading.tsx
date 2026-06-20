import { SiteHeader } from '@/components/layout/site-header'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <Skeleton className="mb-4 h-3 w-24" />
          <Skeleton className="h-12 w-3/4 max-w-xl" />
          <Skeleton className="mt-5 h-4 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-4 w-5/6 max-w-2xl" />

          <div className="mt-16 space-y-16">
            {Array.from({ length: 2 }).map((_, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="mb-6 border-b border-line pb-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="mt-2 h-3 w-full max-w-md" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, productIndex) => (
                    <div
                      key={productIndex}
                      className="overflow-hidden rounded-2xl border border-line bg-paper"
                    >
                      <Skeleton className="aspect-[4/3] w-full rounded-none" />
                      <div className="p-5">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="mt-2 h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
