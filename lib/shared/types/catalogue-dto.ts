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

export interface ProductCategoryPublicDto {
  slug: string
  name: string
  description: string
  imageUrl: string | null
  products: ProductPublicDto[]
}
