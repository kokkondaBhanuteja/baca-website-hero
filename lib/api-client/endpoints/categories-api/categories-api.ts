import type { ProductCategoryAdminDto } from '@/lib/shared/types/catalogue-dto'
import type {
  AdminListQuery,
  PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { CategoryInput } from '@/lib/server/validation/category-schema'

import { apiClient } from '@/lib/api-client/axios-instance'

export const categoriesApi = {
  list: (query: AdminListQuery = {}) =>
    apiClient
      .get<PaginatedList<ProductCategoryAdminDto>>('/categories', {
        params: {
          page: query.page,
          pageSize: query.pageSize,
          q: query.search,
        },
      })
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
