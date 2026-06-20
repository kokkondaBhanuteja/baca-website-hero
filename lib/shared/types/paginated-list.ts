export interface PaginatedList<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface AdminListQuery {
  page?: number
  pageSize?: number
  search?: string
}

export const ADMIN_LIST_DEFAULT_PAGE_SIZE = 10
