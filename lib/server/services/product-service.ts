import 'server-only'

import { Prisma } from '@prisma/client'
import { revalidateTag } from 'next/cache'

import type { Locale } from '@/constants/i18n'
import { destroyUploadedImage } from '@/lib/server/cloudinary/sign-upload'
import { notFoundError } from '@/lib/server/http/http-error'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { localizedValue } from '@/lib/server/localization/localized-value'
import { prisma } from '@/lib/server/prisma'
import type { ProductAdminDto } from '@/lib/shared/types/catalogue-dto'
import type { LocalizedText } from '@/lib/shared/types/localized-text'
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

export async function listProductsForAdmin(): Promise<ProductAdminDto[]> {
  const rows = await prisma.product.findMany({
    orderBy: [{ categoryId: 'asc' }, { sortOrder: 'asc' }],
    include: { category: true },
  })
  return rows.map(mapAdmin)
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

  if (
    existing.imagePublicId &&
    existing.imagePublicId !== input.imagePublicId
  ) {
    await destroyUploadedImage(existing.imagePublicId)
  }

  try {
    const row = await prisma.product.update({
      where: { id },
      data: toData(input),
      include: { category: true },
    })
    revalidateTag(PRODUCTS_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const row = await prisma.product.findUnique({ where: { id } })
  if (!row) throw notFoundError('Product not found')

  await destroyUploadedImage(row.imagePublicId)
  await prisma.product.delete({ where: { id } })
  revalidateTag(PRODUCTS_TAG, 'max')
}

/** Top published products (slug + resolved name) — used by the nav dropdown. */
export async function listPublishedProducts(
  locale: Locale,
  take = 3,
): Promise<{ slug: string; name: string }[]> {
  const rows = await prisma.product.findMany({
    where: { isPublished: true, category: { isPublished: true } },
    orderBy: [{ sortOrder: 'asc' }],
    take,
  })
  return rows.map((row) => ({
    slug: row.slug,
    name: localizedValue(row.name as LocalizedText, locale),
  }))
}
