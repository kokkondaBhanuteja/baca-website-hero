import 'server-only'

import { Prisma } from '@prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

import type { Locale } from '@/constants/i18n'
import { conflictError, notFoundError } from '@/lib/server/http/http-error'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { localizedValue } from '@/lib/server/localization/localized-value'
import { prisma } from '@/lib/server/prisma'
import { BLOG_ARTICLES_TAG } from '@/lib/server/services/blog-article-service'
import type {
  BlogTypeAdminDto,
  BlogTypePublicDto,
} from '@/lib/shared/types/blog-type-dto'
import type { LocalizedText } from '@/lib/shared/types/localized-text'
import {
  ADMIN_LIST_DEFAULT_PAGE_SIZE,
  type AdminListQuery,
  type PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { BlogTypeInput } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

export const BLOG_TYPES_TAG = 'blog-types'

type BlogTypeRow = Prisma.BlogTypeGetPayload<{
  include: { _count: { select: { articles: true } } }
}>

function mapAdmin(row: BlogTypeRow): BlogTypeAdminDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name as LocalizedText,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
    articleCount: row._count.articles,
  }
}

function toData(input: BlogTypeInput) {
  return {
    slug: input.slug,
    name: input.name as Prisma.InputJsonValue,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
  }
}

/** Non-paginated — every type, for the article form's type dropdown. */
export async function listAllBlogTypesForAdmin(): Promise<BlogTypeAdminDto[]> {
  const rows = await prisma.blogType.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { articles: true } } },
  })
  return rows.map(mapAdmin)
}

export async function listBlogTypesForAdmin({
  page = 1,
  pageSize = ADMIN_LIST_DEFAULT_PAGE_SIZE,
  search = '',
}: AdminListQuery = {}): Promise<PaginatedList<BlogTypeAdminDto>> {
  const trimmed = search.trim()
  const where: Prisma.BlogTypeWhereInput | undefined = trimmed
    ? {
        OR: [
          { slug: { contains: trimmed, mode: 'insensitive' } },
          { name: { path: ['en'], string_contains: trimmed } },
        ],
      }
    : undefined

  const [rows, total] = await Promise.all([
    prisma.blogType.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { articles: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogType.count({ where }),
  ])

  return { items: rows.map(mapAdmin), total, page, pageSize }
}

export async function getBlogTypeForAdmin(
  id: string,
): Promise<BlogTypeAdminDto> {
  const row = await prisma.blogType.findUnique({
    where: { id },
    include: { _count: { select: { articles: true } } },
  })
  if (!row) throw notFoundError('Blog type not found')
  return mapAdmin(row)
}

export async function createBlogType(
  input: BlogTypeInput,
): Promise<BlogTypeAdminDto> {
  try {
    const row = await prisma.blogType.create({
      data: toData(input),
      include: { _count: { select: { articles: true } } },
    })
    revalidateTag(BLOG_TYPES_TAG, 'max')
    revalidateTag(BLOG_ARTICLES_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function updateBlogType(
  id: string,
  input: BlogTypeInput,
): Promise<BlogTypeAdminDto> {
  const existing = await prisma.blogType.findUnique({ where: { id } })
  if (!existing) throw notFoundError('Blog type not found')

  try {
    const row = await prisma.blogType.update({
      where: { id },
      data: toData(input),
      include: { _count: { select: { articles: true } } },
    })
    revalidateTag(BLOG_TYPES_TAG, 'max')
    revalidateTag(BLOG_ARTICLES_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function deleteBlogType(id: string): Promise<void> {
  const row = await prisma.blogType.findUnique({
    where: { id },
    include: { _count: { select: { articles: true } } },
  })
  if (!row) throw notFoundError('Blog type not found')
  if (row._count.articles > 0) {
    throw conflictError(
      'Reassign or remove its articles before deleting this blog type',
    )
  }

  try {
    await prisma.blogType.delete({ where: { id } })
  } catch (error) {
    return mapPrismaError(error)
  }
  revalidateTag(BLOG_TYPES_TAG, 'max')
  revalidateTag(BLOG_ARTICLES_TAG, 'max')
}

/**
 * Public read — published types, resolved for the locale, for the filter pills.
 * Tagged so admin mutations (revalidateTag(BLOG_TYPES_TAG)) flush it.
 */
export const listPublishedBlogTypes = unstable_cache(
  async (locale: Locale): Promise<BlogTypePublicDto[]> => {
    const rows = await prisma.blogType.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    })
    return rows.map((row) => ({
      slug: row.slug,
      name: localizedValue(row.name as LocalizedText, locale),
    }))
  },
  ['listPublishedBlogTypes'],
  { tags: [BLOG_TYPES_TAG] },
)
