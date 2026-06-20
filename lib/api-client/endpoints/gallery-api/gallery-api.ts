import type { GalleryImageAdminDto } from '@/lib/shared/types/gallery-dto'
import type { GalleryImageInput } from '@/lib/server/validation/gallery-schema'

import { apiClient } from '@/lib/api-client/axios-instance'

export const galleryApi = {
  list: () =>
    apiClient
      .get<GalleryImageAdminDto[]>('/gallery')
      .then((response) => response.data),
  create: (input: GalleryImageInput) =>
    apiClient
      .post<GalleryImageAdminDto>('/gallery', input)
      .then((response) => response.data),
  remove: (id: string) =>
    apiClient.delete(`/gallery/${id}`).then(() => undefined),
}
