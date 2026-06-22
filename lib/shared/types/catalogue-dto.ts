import type { LocalizedText } from './localized-text'

/** One specification row in a product's key/value grid (not localized). */
export interface ProductSpec {
  label: string
  value: string
}

/** One product image (Cloudinary delivery URL + publicId for transform/delete). */
export interface ProductImage {
  url: string
  publicId: string
}

/** Admin view — raw all-locale objects so edit forms can populate every tab. */
export interface ProductCategoryAdminDto {
  id: string
  slug: string
  name: LocalizedText
  description: LocalizedText | null
  imageUrl: string | null
  imagePublicId: string | null
  sortOrder: number
  isPublished: boolean
  productCount: number
}

export interface ProductAdminDto {
  id: string
  slug: string
  categoryId: string
  categoryName: LocalizedText
  name: LocalizedText
  summary: LocalizedText | null
  description: LocalizedText | null
  botanicalName: string | null
  originRegions: string[]
  specs: ProductSpec[]
  harvestMonths: number[]
  peakMonths: number[]
  imageUrl: string | null
  imagePublicId: string | null
  images: ProductImage[]
  sortOrder: number
  isPublished: boolean
}

/** Public view — strings already resolved for the active locale. */
export interface ProductPublicDto {
  id: string
  slug: string
  name: string
  summary: string
  imageUrl: string | null
  /** First entry from `originRegions` (e.g. "Idukki, Kerala") — surfaced
   *  for the catalogue card's region badge. Optional: not every consumer
   *  populates it (sidebar mini-cards skip it). */
  region?: string
  /** First two `specs` rows — surfaced for the catalogue card's attribute
   *  block (label/value rows). Optional. */
  keySpecs?: ProductSpec[]
}

/** Public product detail — resolved strings for one locale, incl. long copy + attributes. */
export interface ProductDetailPublicDto {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  botanicalName: string
  originRegions: string[]
  specs: ProductSpec[]
  harvestMonths: number[]
  peakMonths: number[]
  imageUrl: string | null
  /** Gallery URLs for the detail-page carousel (resolved; falls back to [imageUrl]). */
  images: string[]
  categorySlug: string
  categoryName: string
}

export interface ProductCategoryPublicDto {
  slug: string
  name: string
  description: string
  imageUrl: string | null
  products: ProductPublicDto[]
}
