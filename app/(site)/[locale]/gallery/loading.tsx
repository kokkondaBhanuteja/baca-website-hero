import { SiteHeader } from '@/components/layout/site-header'
import { Skeleton } from '@/components/ui/skeleton'

export default function GalleryLoading() {
  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <Skeleton className="mb-4 h-3 w-24" />
          <Skeleton className="h-12 w-3/4 max-w-xl" />

          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full" />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
