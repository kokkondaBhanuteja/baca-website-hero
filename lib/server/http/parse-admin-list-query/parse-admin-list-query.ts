import 'server-only'

import {
  ADMIN_LIST_DEFAULT_PAGE_SIZE,
  type AdminListQuery,
} from '@/lib/shared/types/paginated-list'

const MAX_PAGE_SIZE = 100

function parsePositiveInt(raw: string | null, fallback: number): number {
  if (!raw) return fallback
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function parseAdminListQuery(
  request: Request,
): Required<AdminListQuery> {
  const params = new URL(request.url).searchParams
  return {
    page: parsePositiveInt(params.get('page'), 1),
    pageSize: Math.min(
      MAX_PAGE_SIZE,
      parsePositiveInt(params.get('pageSize'), ADMIN_LIST_DEFAULT_PAGE_SIZE),
    ),
    search: params.get('q') ?? '',
  }
}
