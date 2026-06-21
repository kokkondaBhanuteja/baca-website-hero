import { ArrowUpRight, MapPin } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { SITE } from '@/constants/site'

/**
 * Google Maps embed of the corporate address. Uses the public `maps.google.com`
 * iframe so it works with zero configuration — no Maps Embed API key needed.
 * Source of truth for the address is `SITE.address` (already shown on the
 * contact page as the "Corporate Address" card), so updating SITE.address
 * updates both the address block and the pin location in one place.
 */
export async function LocationMap() {
  const t = await getTranslations('contactPage.map')
  const fullAddress = SITE.address.join(', ')
  const encoded = encodeURIComponent(fullAddress)
  const embedSrc = `https://maps.google.com/maps?q=${encoded}&hl=en&z=15&output=embed`
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`

  return (
    <section className="mx-auto max-w-content px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
      <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_1px_0_rgba(22,24,28,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bone text-ink">
              <MapPin className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
                {t('eyebrow')}
              </p>
              <p className="text-sm font-medium text-ink">{fullAddress}</p>
            </div>
          </div>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="fill"
            className="group inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-bone/50"
          >
            {t('directions')}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>
        <iframe
          title={t('iframeTitle')}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block aspect-[16/9] w-full border-0 sm:aspect-[21/9]"
        />
      </div>
    </section>
  )
}
