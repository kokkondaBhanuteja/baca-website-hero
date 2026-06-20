import type { AdminUserDto } from '@/lib/shared/types/admin-user-dto'

import { apiClient } from '@/lib/api-client/axios-instance'

export interface LoginCredentials {
  email: string
  password: string
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient
      .post<AdminUserDto>('/auth/login', credentials)
      .then((response) => response.data),
  logout: () => apiClient.post('/auth/logout').then(() => undefined),
  me: () =>
    apiClient.get<AdminUserDto>('/auth/me').then((response) => response.data),
}
