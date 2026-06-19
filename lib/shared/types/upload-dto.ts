export type UploadFolder =
  | 'baca/products'
  | 'baca/categories'
  | 'baca/blog'
  | 'baca/gallery'

export interface UploadSignature {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: UploadFolder
}

/** What an upload yields and what gets stored on an entity. */
export interface UploadedImage {
  imageUrl: string
  imagePublicId: string
}
