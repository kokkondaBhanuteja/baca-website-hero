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
import { WhatsAppFab } from '@/components/sections/whatsapp-fab'

type PageParams = { params: Promise<{ locale: string }> }

export default async function Page({ params }: PageParams) {
  const { locale } = await params
  // Enable static rendering for this route.
  setRequestLocale(locale as Locale)

  return (
    <main className="min-h-screen bg-paper">
      <ScrollFX />
      <SiteHeader forceSolid />
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
      <SiteFooter />
      <WhatsAppFab />
    </main>
  )
}
