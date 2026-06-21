import type { LocalizedText } from './localized-text'

/** Admin view — raw all-locale name + article count for the table. */
export interface BlogTypeAdminDto {
  id: string
  slug: string
  name: LocalizedText
  sortOrder: number
  isPublished: boolean
  articleCount: number
}

/** Public filter pill — resolved name for the active locale. */
export interface BlogTypePublicDto {
  slug: string
  name: string
}
