import { SiteHeader } from "@/components/site-header"
import { ScrollFX } from "@/components/scroll-fx"
import { Cursor } from "@/components/cursor"
import { Hero } from "@/components/hero"
import { Certifications } from "@/components/certifications"
import { Manifesto } from "@/components/manifesto"
import { StatsRow } from "@/components/stats-row"
import { Approach } from "@/components/approach"
import { ProductPreview } from "@/components/product-preview"
import { GlobalPresence } from "@/components/global-presence"
import { PullQuote } from "@/components/pull-quote"
import { FeaturedInsights } from "@/components/featured-insights"
import { CtaBand } from "@/components/cta-band"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFab } from "@/components/whatsapp-fab"

export default function Page() {
  return (
    <main className="min-h-screen bg-paper">
      <ScrollFX />
      <Cursor />
      <SiteHeader />
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
