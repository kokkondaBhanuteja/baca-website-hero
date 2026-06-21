import type { LocalizedText } from './localized-text'

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
  origin: LocalizedText | null
  specifications: LocalizedText | null
  seasonality: LocalizedText | null
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
  origin: string
  specifications: string
  seasonality: string
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
