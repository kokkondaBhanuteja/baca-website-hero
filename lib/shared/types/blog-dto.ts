import type { LocalizedText } from './localized-text'

export type BlogCategoryValue =
  | 'INDUSTRY_INSIGHTS'
  | 'IMPACT_STORIES'
  | 'COMMUNITY_ENGAGEMENT'

export type ContentStatusValue = 'DRAFT' | 'PUBLISHED'

/** Maps the DB enum to the camelCase message key under `blogsPage.categories`. */
export const BLOG_CATEGORY_KEY: Record<BlogCategoryValue, string> = {
  INDUSTRY_INSIGHTS: 'industryInsights',
  IMPACT_STORIES: 'impactStories',
  COMMUNITY_ENGAGEMENT: 'communityEngagement',
}

/** Admin view — raw all-locale objects for the editor. */
export interface BlogArticleAdminDto {
  id: string
  slug: string
  category: BlogCategoryValue
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText
  coverImageUrl: string | null
  coverImagePublicId: string | null
  readMinutes: number
  status: ContentStatusValue
  featured: boolean
  publishedAt: string | null
}

/** Public listing card — resolved for the active locale. */
export interface BlogArticleSummaryDto {
  slug: string
  category: BlogCategoryValue
  title: string
  excerpt: string
  coverImageUrl: string | null
  readMinutes: number
  featured: boolean
  publishedAt: string | null
}

/** Public article detail — resolved, including the body. */
export interface BlogArticleDetailDto extends BlogArticleSummaryDto {
  body: string
}
