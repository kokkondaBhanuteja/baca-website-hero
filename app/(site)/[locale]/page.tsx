import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { ScrollFX } from '@/components/ui/scroll-fx'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Hero } from '@/components/sections/hero'
import { Manifesto } from '@/components/sections/manifesto'
import { StatsRow } from '@/components/sections/stats-row'
import { ProductPreview } from '@/components/sections/product-preview'
import { Approach } from '@/components/sections/approach'
import { Certifications } from '@/components/sections/certifications'
import { GlobalPresence } from '@/components/sections/global-presence'
import { PullQuote } from '@/components/sections/pull-quote'
import { FeaturedInsights } from '@/components/sections/featured-insights'
import { CtaBand } from '@/components/sections/cta-band'

type PageParams = { params: Promise<{ locale: string }> }

/** ISR fallback; admin CMS edits invalidate DB slices via cache tags in lib/server/services/*. */
export const revalidate = 3600

export default async function Page({ params }: PageParams) {
  const { locale } = await params
  // Enable static rendering for this route.
  setRequestLocale(locale as Locale)

  return (
    <>
      <ScrollFX />
      {/* The hero is a light pale-sage field: the header rides transparent with
          DARK text over it, then its background turns solid-white on scroll. */}
      <SiteHeader lightHero />
      <main id="main" className="min-h-screen bg-paper">
        <Hero />
        <Manifesto />
        <StatsRow />
        <ProductPreview />
        <Approach />
        <Certifications />
        <GlobalPresence />
        <PullQuote />
        <FeaturedInsights />
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  )
}
