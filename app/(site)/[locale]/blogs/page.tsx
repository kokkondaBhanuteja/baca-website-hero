import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { listPublishedArticles } from '@/lib/server/services/blog-article-service'
import { listPublishedBlogTypes } from '@/lib/server/services/blog-type-service'
import { PageIntro } from '@/components/shared/page-intro'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

import { BlogsFilter } from './blogs-filter'

export const dynamic = 'force-dynamic'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'blogsPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('intro') }
}

export default async function BlogsPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('blogsPage')
  const [articles, types] = await Promise.all([
    listPublishedArticles(locale as Locale),
    listPublishedBlogTypes(locale as Locale),
  ])

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <PageIntro
            eyebrow={t('eyebrow')}
            heading={t('heading')}
            intro={t('intro')}
          />

          <BlogsFilter
            articles={articles}
            types={types}
            locale={locale as Locale}
            labels={{
              all: t('allArticles'),
              filterBy: t('filterBy'),
              minRead: t('minRead'),
              featured: t('featured'),
              empty: t('empty'),
              published: t('publishedLabel'),
              readTime: t('readTimeLabel'),
            }}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
