import 'server-only'

import { Prisma } from '@prisma/client'
import { revalidateTag } from 'next/cache'

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

export async function listCategoriesForAdmin(): Promise<
  ProductCategoryAdminDto[]
> {
  const rows = await prisma.productCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return rows.map(mapAdmin)
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

  // If the image was replaced, clean up the old asset.
  if (
    existing.imagePublicId &&
    existing.imagePublicId !== input.imagePublicId
  ) {
    await destroyUploadedImage(existing.imagePublicId)
  }

  try {
    const row = await prisma.productCategory.update({
      where: { id },
      data: toData(input),
      include: { _count: { select: { products: true } } },
    })
    revalidateTag(CATEGORIES_TAG, 'max')
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

  await destroyUploadedImage(row.imagePublicId)
  await prisma.productCategory.delete({ where: { id } })
  revalidateTag(CATEGORIES_TAG, 'max')
}

/** Public read — categories with their published products, resolved for the locale. */
export async function getCategoriesForLocale(
  locale: Locale,
): Promise<ProductCategoryPublicDto[]> {
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
      summary: localizedValue(product.summary as LocalizedText | null, locale),
      imageUrl: optimizedImageUrl(product.imageUrl),
    })),
  }))
}
