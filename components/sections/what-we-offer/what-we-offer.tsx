import { getLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { getCategoriesForLocale } from '@/lib/server/services/category-service'
import { WhatWeOfferClient } from './what-we-offer-client'

export async function WhatWeOffer() {
  const locale = (await getLocale()) as Locale
  const categories = await getCategoriesForLocale(locale)
  if (categories.length === 0) return null

  const allProducts = categories.flatMap((cat) => cat.products)
  if (allProducts.length === 0) return null

  // Ensure exactly 6 products — duplicate if fewer in DB
  const products = Array.from(
    { length: 6 },
    (_, i) => allProducts[i % allProducts.length],
  )

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-4 border-b border-[#2E0F13]/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.42em] text-[#2E0F13]/40">
              What We Offer
            </p>
            <h2 className="font-heading text-[2.8rem] font-light leading-[1.05] text-[#1A0B07] sm:text-[3.8rem]">
              Our Product Range
            </h2>
            <p className="mt-3 max-w-md text-[0.9rem] leading-[1.9] text-[#1A0B07]/52">
              Sourced from India&apos;s finest growing regions — tested,
              certified, and shipped with full traceability.
            </p>
          </div>
          <Link
            href={Route.Products}
            className="shrink-0 pb-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#1A0B07]/38 transition-colors hover:text-[#1A0B07]"
          >
            View all products →
          </Link>
        </div>

        {/* Carousel — 3 visible at a time, 6 total */}
        <WhatWeOfferClient products={products} />
      </div>
    </section>
  )
}
