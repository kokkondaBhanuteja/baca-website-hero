import 'server-only'

import { Prisma } from '@prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

import type { Locale } from '@/constants/i18n'
import { destroyUploadedImage } from '@/lib/server/cloudinary/sign-upload'
import { conflictError, notFoundError } from '@/lib/server/http/http-error'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { localizedValue } from '@/lib/server/localization/localized-value'
import { prisma } from '@/lib/server/prisma'
import { optimizedImageUrl } from '@/lib/shared/cloudinary-url'
import type {
  ProductCategoryAdminDto,
  ProductCategoryPublicDto,
} from '@/lib/shared/types/catalogue-dto'
import type { LocalizedText } from '@/lib/shared/types/localized-text'
import {
  ADMIN_LIST_DEFAULT_PAGE_SIZE,
  type AdminListQuery,
  type PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { CategoryInput } from '@/lib/server/validation/category-schema'

export const CATEGORIES_TAG = 'categories'

type CategoryRow = Prisma.ProductCategoryGetPayload<{
  include: { _count: { select: { products: true } } }
}>

function mapAdmin(row: CategoryRow): ProductCategoryAdminDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name as LocalizedText,
    description: (row.description as LocalizedText | null) ?? null,
    imageUrl: row.imageUrl,
    imagePublicId: row.imagePublicId,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
    productCount: row._count.products,
  }
}

function toData(input: CategoryInput) {
  return {
    slug: input.slug,
    name: input.name as Prisma.InputJsonValue,
    description: input.description
      ? (input.description as Prisma.InputJsonValue)
      : Prisma.DbNull,
    imageUrl: input.imageUrl ?? null,
    imagePublicId: input.imagePublicId ?? null,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
  }
}

/**
 * Non-paginated read of every category, ordered by sortOrder. Used by the
 * product form's "Category" dropdown — that dropdown needs every category, not
 * a paginated slice. Admins realistically have a handful of categories so an
 * unbounded read is fine; if this ever grows past ~hundreds we can paginate
 * the dropdown with an async-load pattern.
 */
export async function listAllCategoriesForAdmin(): Promise<
  ProductCategoryAdminDto[]
> {
  const rows = await prisma.productCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return rows.map(mapAdmin)
}

export async function listCategoriesForAdmin({
  page = 1,
  pageSize = ADMIN_LIST_DEFAULT_PAGE_SIZE,
  search = '',
}: AdminListQuery = {}): Promise<PaginatedList<ProductCategoryAdminDto>> {
  const trimmed = search.trim()
  const where: Prisma.ProductCategoryWhereInput | undefined = trimmed
    ? {
        OR: [
          { slug: { contains: trimmed, mode: 'insensitive' } },
          { name: { path: ['en'], string_contains: trimmed } },
        ],
      }
    : undefined

  const [rows, total] = await Promise.all([
    prisma.productCategory.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.productCategory.count({ where }),
  ])

  return { items: rows.map(mapAdmin), total, page, pageSize }
}

export async function getCategoryForAdmin(
  id: string,
): Promise<ProductCategoryAdminDto> {
  const row = await prisma.productCategory.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
  if (!row) throw notFoundError('Category not found')
  return mapAdmin(row)
}

export async function createCategory(
  input: CategoryInput,
): Promise<ProductCategoryAdminDto> {
  try {
    const row = await prisma.productCategory.create({
      data: toData(input),
      include: { _count: { select: { products: true } } },
    })
    revalidateTag(CATEGORIES_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<ProductCategoryAdminDto> {
  const existing = await prisma.productCategory.findUnique({ where: { id } })
  if (!existing) throw notFoundError('Category not found')

  // Capture the prior publicId BEFORE the update, but DO NOT destroy yet.
  // Cloudinary destruction is irreversible; if prisma.update throws (P2002 slug
  // conflict, P2025 row gone) we'd lose the asset while the DB still references
  // its publicId. Destroy only after the update commits.
  const previousImagePublicId =
    existing.imagePublicId && existing.imagePublicId !== input.imagePublicId
      ? existing.imagePublicId
      : null

  try {
    const row = await prisma.productCategory.update({
      where: { id },
      data: toData(input),
      include: { _count: { select: { products: true } } },
    })
    revalidateTag(CATEGORIES_TAG, 'max')
    if (previousImagePublicId) {
      await destroyUploadedImage(previousImagePublicId)
    }
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const row = await prisma.productCategory.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
  if (!row) throw notFoundError('Category not found')
  if (row._count.products > 0) {
    throw conflictError(
      'Reassign or remove its products before deleting this category',
    )
  }

  // Delete the DB row first; only destroy the Cloudinary asset after success.
  // A product could be added concurrently (TOCTOU with the count check above)
  // and trigger an FK error, or another transient error could surface; in those
  // cases we'd otherwise have an orphaned Cloudinary asset and a 5xx response.
  // mapPrismaError translates P2002/P2003/P2025 into HttpError so admins see the
  // right code.
  try {
    await prisma.productCategory.delete({ where: { id } })
  } catch (error) {
    return mapPrismaError(error)
  }
  revalidateTag(CATEGORIES_TAG, 'max')
  if (row.imagePublicId) {
    await destroyUploadedImage(row.imagePublicId)
  }
}

/**
 * Public read — categories with their published products, resolved for the locale.
 *
 * Wrapped in `unstable_cache` with `tags: [CATEGORIES_TAG]` so SSG pages (the
 * home product preview / nav dropdown) actually re-fetch when admin mutations
 * call `revalidateTag(CATEGORIES_TAG, 'max')`. Without this association the
 * tag-invalidation is a no-op and the home page shows build-time data forever.
 */
export const getCategoriesForLocale = unstable_cache(
  async (locale: Locale): Promise<ProductCategoryPublicDto[]> => {
    const rows = await prisma.productCategory.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        products: {
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return rows.map((category) => ({
      slug: category.slug,
      name: localizedValue(category.name as LocalizedText, locale),
      description: localizedValue(
        category.description as LocalizedText | null,
        locale,
      ),
      imageUrl: optimizedImageUrl(category.imageUrl),
      products: category.products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: localizedValue(product.name as LocalizedText, locale),
        summary: localizedValue(
          product.summary as LocalizedText | null,
          locale,
        ),
        imageUrl: optimizedImageUrl(product.imageUrl),
      })),
    }))
  },
  ['getCategoriesForLocale'],
  { tags: [CATEGORIES_TAG] },
)
