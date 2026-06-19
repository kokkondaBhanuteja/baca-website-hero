import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { listPublishedGallery } from '@/lib/server/services/gallery-service'
import { MediaReveal } from '@/components/ui/media-reveal'
import { PageIntro } from '@/components/shared/page-intro'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export const dynamic = 'force-dynamic'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'galleryPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('intro') }
}

export default async function GalleryPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('galleryPage')
  const images = await listPublishedGallery(locale as Locale)

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-[72px]">
        <section className="mx-auto max-w-[1340px] px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <PageIntro
            eyebrow={t('eyebrow')}
            heading={t('heading')}
            intro={t('intro')}
          />

          {images.length === 0 ? (
            <p className="mt-16 text-ink-60">{t('empty')}</p>
          ) : (
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <figure
                  key={image.id}
                  className="group overflow-hidden rounded-2xl border border-line"
                >
                  <MediaReveal>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.imageUrl}
                      alt={image.caption}
                      className="aspect-square w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  </MediaReveal>
                  {image.caption && (
                    <figcaption className="px-4 py-3 text-[13px] text-ink-60">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
