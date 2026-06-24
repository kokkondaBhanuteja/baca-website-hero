import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { ScrollFX } from '@/components/ui/scroll-fx'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Hero } from '@/components/sections/hero'
import { BacaStory } from '@/components/sections/baca-story'
import { WhatWeOffer } from '@/components/sections/what-we-offer'
import { WhyBaca } from '@/components/sections/why-baca'
import { FeaturedInsights } from '@/components/sections/featured-insights'

type PageParams = { params: Promise<{ locale: string }> }

/** ISR fallback; admin CMS edits invalidate DB slices via cache tags in lib/server/services/*. */
export const revalidate = 3600

export default async function Page({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  return (
    <>
      <ScrollFX />
      <SiteHeader lightHero />
      <main id="main" className="min-h-screen bg-paper">
        <Hero />
        <BacaStory />
        <WhatWeOffer />
        <WhyBaca />
        <FeaturedInsights />
      </main>
      <SiteFooter />
    </>
  )
}
