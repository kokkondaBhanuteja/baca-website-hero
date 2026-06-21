import type { LocalizedText } from './localized-text'

export type ContentStatusValue = 'DRAFT' | 'PUBLISHED'

/** Admin view — raw all-locale objects for the editor. */
export interface BlogArticleAdminDto {
  id: string
  slug: string
  blogTypeId: string
  blogTypeName: string
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText
  coverImageUrl: string | null
  coverImagePublicId: string | null
  authorName: string | null
  authorRole: string | null
  authorAvatarUrl: string | null
  authorAvatarPublicId: string | null
  readMinutes: number
  status: ContentStatusValue
  featured: boolean
  publishedAt: string | null
}

/** Public listing card — resolved for the active locale. */
export interface BlogArticleSummaryDto {
  slug: string
  blogType: {
    slug: string
    name: string
  }
  title: string
  excerpt: string
  coverImageUrl: string | null
  authorName: string | null
  authorRole: string | null
  authorAvatarUrl: string | null
  readMinutes: number
  featured: boolean
  publishedAt: string | null
}

/** Public article detail — resolved, including the body. */
export interface BlogArticleDetailDto extends BlogArticleSummaryDto {
  body: string
}
