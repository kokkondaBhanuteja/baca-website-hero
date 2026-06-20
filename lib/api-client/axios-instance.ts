import 'client-only'

import axios, { type AxiosError } from 'axios'

/**
 * The single global axios instance for all client-side (admin) API calls.
 * Same-origin (`/api`), sends the httpOnly session cookie, and refuses to follow
 * absolute URLs so a crafted path can't escape the API surface.
 */
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15_000,
  withCredentials: true,
  allowAbsoluteUrls: false,
  headers: { 'Content-Type': 'application/json' },
})

export interface NormalizedApiError {
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
}

interface ApiErrorBody {
  code?: string
  message?: string
  fieldErrors?: Record<string, string[]>
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status
    if (
      status === 401 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.endsWith('/admin/login')
    ) {
      window.location.assign('/admin/login')
    }

    const body = error.response?.data
    const normalized: NormalizedApiError = {
      code: body?.code ?? 'NETWORK_ERROR',
      message: body?.message ?? error.message ?? 'Request failed',
      fieldErrors: body?.fieldErrors,
    }
    return Promise.reject(normalized)
  },
)
