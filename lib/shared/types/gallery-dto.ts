import type { LocalizedText } from './localized-text'

export type GalleryMediaTypeValue = 'PHOTO' | 'VIDEO'

export interface GalleryImageAdminDto {
  id: string
  caption: LocalizedText | null
  imageUrl: string
  imagePublicId: string
  mediaType: GalleryMediaTypeValue
  sortOrder: number
  isPublished: boolean
}

export interface GalleryImagePublicDto {
  id: string
  caption: string
  imageUrl: string
}
