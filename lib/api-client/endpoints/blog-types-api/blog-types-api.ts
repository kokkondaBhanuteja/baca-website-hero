import type { BlogTypeAdminDto } from '@/lib/shared/types/blog-type-dto'
import type {
  AdminListQuery,
  PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { BlogTypeInput } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

import { apiClient } from '@/lib/api-client/axios-instance'

export const blogTypesApi = {
  list: (query: AdminListQuery = {}) =>
    apiClient
      .get<PaginatedList<BlogTypeAdminDto>>('/blog-types', {
        params: {
          page: query.page,
          pageSize: query.pageSize,
          q: query.search,
        },
      })
      .then((response) => response.data),
  get: (id: string) =>
    apiClient
      .get<BlogTypeAdminDto>(`/blog-types/${id}`)
      .then((response) => response.data),
  create: (input: BlogTypeInput) =>
    apiClient
      .post<BlogTypeAdminDto>('/blog-types', input)
      .then((response) => response.data),
  update: (id: string, input: BlogTypeInput) =>
    apiClient
      .patch<BlogTypeAdminDto>(`/blog-types/${id}`, input)
      .then((response) => response.data),
  remove: (id: string) =>
    apiClient.delete(`/blog-types/${id}`).then(() => undefined),
}
