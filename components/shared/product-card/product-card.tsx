import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import type { ProductPublicDto } from '@/lib/shared/types/catalogue-dto'
import { MediaReveal } from '@/components/ui/media-reveal'

/**
 * Catalogue product card — image + name + summary, linking to the product
 * detail page. Shared by the `/products` grid and the detail page's "Pairs
 * naturally" grid so the two stay identical. Keeps `id={slug}` so the listing's
 * in-page anchors (`/products#green-cardamom`) still resolve.
 */
export function ProductCard({ product }: { product: ProductPublicDto }) {
  return (
    <Link
      href={`${Route.Products}/${product.slug}`}
      id={product.slug}
      className="group block scroll-mt-header-offset overflow-hidden rounded-2xl border border-line bg-paper transition-colors hover:border-ink/30"
    >
      <MediaReveal className="aspect-[4/3]">
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
      </MediaReveal>
      <div className="p-5">
        <h3 className="font-heading text-lg font-light text-ink transition-colors group-hover:text-clay">
          {product.name}
        </h3>
        {product.summary && (
          <p className="mt-1 text-[13px] leading-relaxed text-ink-60">
            {product.summary}
          </p>
        )}
      </div>
    </Link>
  )
}
