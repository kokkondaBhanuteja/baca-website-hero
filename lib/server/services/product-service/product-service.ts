import 'server-only'

import { Prisma } from '@prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

import type { Locale } from '@/constants/i18n'
import { destroyUploadedImage } from '@/lib/server/cloudinary/sign-upload'
import { notFoundError } from '@/lib/server/http/http-error'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { localizedValue } from '@/lib/server/localization/localized-value'
import { prisma } from '@/lib/server/prisma'
import type { ProductAdminDto } from '@/lib/shared/types/catalogue-dto'
import type { LocalizedText } from '@/lib/shared/types/localized-text'
import {
  ADMIN_LIST_DEFAULT_PAGE_SIZE,
  type AdminListQuery,
  type PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { ProductInput } from '@/lib/server/validation/product-schema'

export const PRODUCTS_TAG = 'products'

type ProductRow = Prisma.ProductGetPayload<{ include: { category: true } }>

function mapAdmin(row: ProductRow): ProductAdminDto {
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.categoryId,
    categoryName: row.category.name as LocalizedText,
    name: row.name as LocalizedText,
    summary: (row.summary as LocalizedText | null) ?? null,
    description: (row.description as LocalizedText | null) ?? null,
    imageUrl: row.imageUrl,
    imagePublicId: row.imagePublicId,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  }
}

function toData(input: ProductInput) {
  return {
    slug: input.slug,
    categoryId: input.categoryId,
    name: input.name as Prisma.InputJsonValue,
    summary: input.summary
      ? (input.summary as Prisma.InputJsonValue)
      : Prisma.DbNull,
    description: input.description
      ? (input.description as Prisma.InputJsonValue)
      : Prisma.DbNull,
    imageUrl: input.imageUrl ?? null,
    imagePublicId: input.imagePublicId ?? null,
    sortOrder: input.sortOrder,
    isPublished: input.isPublished,
  }
}

export async function listProductsForAdmin({
  page = 1,
  pageSize = ADMIN_LIST_DEFAULT_PAGE_SIZE,
  search = '',
}: AdminListQuery = {}): Promise<PaginatedList<ProductAdminDto>> {
  const trimmed = search.trim()
  const where: Prisma.ProductWhereInput | undefined = trimmed
    ? {
        OR: [
          { slug: { contains: trimmed, mode: 'insensitive' } },
          { name: { path: ['en'], string_contains: trimmed } },
          {
            category: { name: { path: ['en'], string_contains: trimmed } },
          },
        ],
      }
    : undefined

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
      include: { category: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return { items: rows.map(mapAdmin), total, page, pageSize }
}

export async function getProductForAdmin(id: string): Promise<ProductAdminDto> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  })
  if (!row) throw notFoundError('Product not found')
  return mapAdmin(row)
}

export async function createProduct(
  input: ProductInput,
): Promise<ProductAdminDto> {
  try {
    const row = await prisma.product.create({
      data: toData(input),
      include: { category: true },
    })
    revalidateTag(PRODUCTS_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductAdminDto> {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) throw notFoundError('Product not found')

  // Capture the prior publicId BEFORE the update, but DO NOT destroy yet.
  // Cloudinary destruction is irreversible; if prisma.update throws (P2002 slug
  // conflict, P2025 row gone) we'd lose the asset while the DB still references
  // its publicId. Destroy only after the update commits.
  const previousImagePublicId =
    existing.imagePublicId && existing.imagePublicId !== input.imagePublicId
      ? existing.imagePublicId
      : null

  try {
    const row = await prisma.product.update({
      where: { id },
      data: toData(input),
      include: { category: true },
    })
    revalidateTag(PRODUCTS_TAG, 'max')
    if (previousImagePublicId) {
      await destroyUploadedImage(previousImagePublicId)
    }
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const row = await prisma.product.findUnique({ where: { id } })
  if (!row) throw notFoundError('Product not found')

  // Delete the DB row first; only destroy the Cloudinary asset after success.
  // Otherwise an FK / transient prisma error orphans the image while the row
  // (and its publicId reference) is still in the DB.
  try {
    await prisma.product.delete({ where: { id } })
  } catch (error) {
    return mapPrismaError(error)
  }
  revalidateTag(PRODUCTS_TAG, 'max')
  if (row.imagePublicId) {
    await destroyUploadedImage(row.imagePublicId)
  }
}

/**
 * Top published products (slug + resolved name) — used by the nav dropdown.
 *
 * Cached + tagged with PRODUCTS_TAG so the SSG home nav refreshes when an
 * admin publishes/unpublishes a product (the matching `revalidateTag` fires
 * inside create/update/delete).
 */
export const listPublishedProducts = unstable_cache(
  async (
    locale: Locale,
    take = 3,
  ): Promise<{ slug: string; name: string }[]> => {
    const rows = await prisma.product.findMany({
      where: { isPublished: true, category: { isPublished: true } },
      // Match the admin list ordering ([categoryId, sortOrder]) so admins see
      // the same "top 3" in the nav preview as in the admin table.
      orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
      take,
    })
    return rows.map((row) => ({
      slug: row.slug,
      name: localizedValue(row.name as LocalizedText, locale),
    }))
  },
  ['listPublishedProducts'],
  { tags: [PRODUCTS_TAG] },
)
