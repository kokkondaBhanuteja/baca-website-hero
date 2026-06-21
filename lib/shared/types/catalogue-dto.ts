import type { LocalizedText } from './localized-text'

/** One specification row in a product's key/value grid (not localized). */
export interface ProductSpec {
  label: string
  value: string
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
