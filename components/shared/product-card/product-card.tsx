import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import type { ProductPublicDto } from '@/lib/shared/types/catalogue-dto'
import { MediaReveal } from '@/components/ui/media-reveal'

/**
 * Catalogue product card — cover image with region badge, then a cream
 * info panel (name, italic tagline, two label/value attribute rows). Linked
 * to the product detail page. Keeps `id={slug}` so the listing's in-page
 * anchors (`/products#green-cardamom`) still resolve from the header nav.
 *
 * The optional fields (`region`, `keySpecs`) are populated by the catalogue
 * read path (`getCategoriesForLocale`); when absent, the matching slot
 * collapses cleanly so the same card still works on other surfaces that
 * skip them.
 */
export function ProductCard({ product }: { product: ProductPublicDto }) {
  const keySpecs = product.keySpecs ?? []

  return (
    <Link
      href={`${Route.Products}/${product.slug}`}
      id={product.slug}
      className="group block scroll-mt-header-offset overflow-hidden rounded-2xl border border-line bg-cream transition-colors hover:border-ink/30"
    >
      <MediaReveal className="relative aspect-[4/3] bg-bone">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-bone" />
        )}
        {product.region && (
          <span className="absolute start-3 top-3 inline-block rounded-full bg-ink/85 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper backdrop-blur-sm">
            {product.region}
          </span>
        )}
      </MediaReveal>

      <div className="px-5 pb-5 pt-4">
        <h3 className="font-heading text-xl font-medium leading-snug text-ink transition-colors group-hover:text-clay">
          {product.name}
        </h3>
        {product.summary && (
          <p className="mt-1 font-heading text-[14px] italic leading-snug text-clay">
            {product.summary}
          </p>
        )}

        {keySpecs.length > 0 && (
          <dl className="mt-5 space-y-2 border-t border-line pt-4">
            {keySpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-3"
              >
                <dt className="text-[13px] text-ink/60">{spec.label}</dt>
                <dd className="text-end text-[13px] font-medium text-ink">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Link>
  )
}
