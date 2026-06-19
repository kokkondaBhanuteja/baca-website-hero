import type { ProductCategoryAdminDto } from '@/lib/shared/types/catalogue-dto'
import type { CategoryInput } from '@/lib/server/validation/category-schema'

import { apiClient } from '../axios-instance'

export const categoriesApi = {
  list: () =>
    apiClient
      .get<ProductCategoryAdminDto[]>('/categories')
      .then((response) => response.data),
  get: (id: string) =>
    apiClient
      .get<ProductCategoryAdminDto>(`/categories/${id}`)
      .then((response) => response.data),
  create: (input: CategoryInput) =>
    apiClient
      .post<ProductCategoryAdminDto>('/categories', input)
      .then((response) => response.data),
  update: (id: string, input: CategoryInput) =>
    apiClient
      .patch<ProductCategoryAdminDto>(`/categories/${id}`, input)
      .then((response) => response.data),
  remove: (id: string) =>
    apiClient.delete(`/categories/${id}`).then(() => undefined),
}
