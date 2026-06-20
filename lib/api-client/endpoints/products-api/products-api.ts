import type { ProductAdminDto } from '@/lib/shared/types/catalogue-dto'
import type { ProductInput } from '@/lib/server/validation/product-schema'

import { apiClient } from '@/lib/api-client/axios-instance'

export const productsApi = {
  list: () =>
    apiClient
      .get<ProductAdminDto[]>('/products')
      .then((response) => response.data),
  get: (id: string) =>
    apiClient
      .get<ProductAdminDto>(`/products/${id}`)
      .then((response) => response.data),
  create: (input: ProductInput) =>
    apiClient
      .post<ProductAdminDto>('/products', input)
      .then((response) => response.data),
  update: (id: string, input: ProductInput) =>
    apiClient
      .patch<ProductAdminDto>(`/products/${id}`, input)
      .then((response) => response.data),
  remove: (id: string) =>
    apiClient.delete(`/products/${id}`).then(() => undefined),
}
