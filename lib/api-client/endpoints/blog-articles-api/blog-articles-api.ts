import type { BlogArticleAdminDto } from '@/lib/shared/types/blog-dto'
import type {
  AdminListQuery,
  PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { BlogArticleInput } from '@/lib/server/validation/blog-article-schema'

import { apiClient } from '@/lib/api-client/axios-instance'

export const blogArticlesApi = {
  list: (query: AdminListQuery = {}) =>
    apiClient
      .get<PaginatedList<BlogArticleAdminDto>>('/blog-articles', {
        params: {
          page: query.page,
          pageSize: query.pageSize,
          q: query.search,
        },
      })
      .then((response) => response.data),
  get: (id: string) =>
    apiClient
      .get<BlogArticleAdminDto>(`/blog-articles/${id}`)
      .then((response) => response.data),
  create: (input: BlogArticleInput) =>
    apiClient
      .post<BlogArticleAdminDto>('/blog-articles', input)
      .then((response) => response.data),
  update: (id: string, input: BlogArticleInput) =>
    apiClient
      .patch<BlogArticleAdminDto>(`/blog-articles/${id}`, input)
      .then((response) => response.data),
  remove: (id: string) =>
    apiClient.delete(`/blog-articles/${id}`).then(() => undefined),
}
