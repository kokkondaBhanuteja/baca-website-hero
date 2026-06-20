import { SiteHeader } from '@/components/layout/site-header'
import { Skeleton } from '@/components/ui/skeleton'

export default function ArticleLoading() {
  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-3xl px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
          <Skeleton className="mb-4 h-3 w-20" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="mt-3 h-14 w-3/4" />
          <Skeleton className="mt-6 h-3 w-40" />
          <Skeleton className="mt-10 aspect-[16/9] w-full rounded-2xl" />
          <div className="mt-10 space-y-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className={index % 4 === 3 ? 'h-4 w-3/5' : 'h-4 w-full'}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
