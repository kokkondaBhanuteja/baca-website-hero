import type { BlogArticleAdminDto } from '@/lib/shared/types/blog-dto'
import type { BlogArticleInput } from '@/lib/server/validation/blog-article-schema'

import { apiClient } from '../axios-instance'

export const blogArticlesApi = {
  list: () =>
    apiClient
      .get<BlogArticleAdminDto[]>('/blog-articles')
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
