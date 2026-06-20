import { SiteHeader } from '@/components/layout/site-header'
import { Skeleton } from '@/components/ui/skeleton'

export default function BlogsLoading() {
  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <Skeleton className="mb-4 h-3 w-24" />
          <Skeleton className="h-12 w-3/4 max-w-xl" />
          <Skeleton className="mt-5 h-4 w-full max-w-2xl" />

          <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="aspect-[16/11] w-full rounded-2xl" />
                <div className="mt-5 flex gap-3">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="mt-4 h-6 w-full" />
                <Skeleton className="mt-2 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-4/5" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
