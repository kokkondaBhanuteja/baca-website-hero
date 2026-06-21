import 'server-only'

import { Prisma } from '@prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

import type { Locale } from '@/constants/i18n'
import { destroyUploadedImage } from '@/lib/server/cloudinary/sign-upload'
import { notFoundError } from '@/lib/server/http/http-error'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { localizedValue } from '@/lib/server/localization/localized-value'
import { prisma } from '@/lib/server/prisma'
import { optimizedImageUrl } from '@/lib/shared/cloudinary-url'
import type {
  ProductAdminDto,
  ProductDetailPublicDto,
  ProductImage,
  ProductPublicDto,
  ProductSpec,
} from '@/lib/shared/types/catalogue-dto'
import type { LocalizedText } from '@/lib/shared/types/localized-text'
import {
  ADMIN_LIST_DEFAULT_PAGE_SIZE,
  type AdminListQuery,
  type PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { ProductInput } from '@/lib/server/validation/product-schema'

export const PRODUCTS_TAG = 'products'

type ProductRow = Prisma.ProductGetPayload<{ include: { category: true } }>

/** Collect every Cloudinary publicId a product references (gallery + legacy cover). */
function productPublicIds(
  images: ProductImage[],
  cover: string | null,
): string[] {
  const ids = images.map((image) => image.publicId)
  if (cover) ids.push(cover)
  return ids.filter(Boolean)
}

function mapAdmin(row: ProductRow): ProductAdminDto {
  return {
    id: row.id,
    slug: row.slug,
    categoryId: row.categoryId,
    categoryName: row.category.name as LocalizedText,
    name: row.name as LocalizedText,
    summary: (row.summary as LocalizedText | null) ?? null,
    description: (row.description as LocalizedText | null) ?? null,
    botanicalName: row.botanicalName,
    originRegions: (row.originRegions as string[] | null) ?? [],
    specs: (row.specs as ProductSpec[] | null) ?? [],
    harvestMonths: (row.harvestMonths as number[] | null) ?? [],
    peakMonths: (row.peakMonths as number[] | null) ?? [],
    imageUrl: row.imageUrl,
    imagePublicId: row.imagePublicId,
    images: (row.images as ProductImage[] | null) ?? [],
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  }
}

function toData(input: ProductInput) {
  // The cover (imageUrl/imagePublicId) is derived from the first gallery image
  // so cards / grid / SEO keep working off a single scalar. Legacy callers that
  // still send imageUrl directly (no images[]) are honoured as a fallback.
  const cover = input.images?.[0] ?? null
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
    botanicalName: input.botanicalName ?? null,
    originRegions: input.originRegions?.length
      ? (input.originRegions as Prisma.InputJsonValue)
      : Prisma.DbNull,
    specs: input.specs?.length
      ? (input.specs as Prisma.InputJsonValue)
      : Prisma.DbNull,
    harvestMonths: input.harvestMonths?.length
      ? (input.harvestMonths as Prisma.InputJsonValue)
      : Prisma.DbNull,
    peakMonths: input.peakMonths?.length
      ? (input.peakMonths as Prisma.InputJsonValue)
      : Prisma.DbNull,
    images: input.images?.length
      ? (input.images as Prisma.InputJsonValue)
      : Prisma.DbNull,
    imageUrl: cover?.url ?? input.imageUrl ?? null,
    imagePublicId: cover?.publicId ?? input.imagePublicId ?? null,
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
      orderBy: [
        { categoryId: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
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

  // Work out which Cloudinary assets are being dropped, but DO NOT destroy yet.
  // Destruction is irreversible; if prisma.update throws (P2002 slug conflict,
  // P2025 row gone) we'd lose assets the DB still references. Destroy only after
  // the update commits. We compare the full set of old publicIds (gallery +
  // legacy cover) against the new set and remove the difference.
  const previousIds = productPublicIds(
    (existing.images as ProductImage[] | null) ?? [],
    existing.imagePublicId,
  )
  const nextIds = new Set(
    productPublicIds(input.images ?? [], input.imagePublicId ?? null),
  )
  const removedIds = previousIds.filter((publicId) => !nextIds.has(publicId))

  try {
    const row = await prisma.product.update({
      where: { id },
      data: toData(input),
      include: { category: true },
    })
    revalidateTag(PRODUCTS_TAG, 'max')
    for (const publicId of removedIds) {
      await destroyUploadedImage(publicId)
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
  for (const publicId of productPublicIds(
    (row.images as ProductImage[] | null) ?? [],
    row.imagePublicId,
  )) {
    await destroyUploadedImage(publicId)
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
      orderBy: [
        { categoryId: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
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

/**
 * Single published product by slug (with its category), resolved for the locale.
 * Returns null when the slug is unknown, the product is unpublished, or its
 * category is unpublished — the detail page calls notFound() on null.
 * Cached + tagged with PRODUCTS_TAG so admin edits flush it.
 */
export const getPublishedProductBySlug = unstable_cache(
  async (
    slug: string,
    locale: Locale,
  ): Promise<ProductDetailPublicDto | null> => {
    // slug is a unique column → findUnique (cheaper than findFirst).
    const row = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!row || !row.isPublished || !row.category.isPublished) return null
    // Carousel gallery: resolved gallery URLs, falling back to the cover so
    // legacy single-image products still show one slide.
    const gallery = (row.images as ProductImage[] | null) ?? []
    const galleryUrls = (
      gallery.length
        ? gallery.map((image) => optimizedImageUrl(image.url))
        : [optimizedImageUrl(row.imageUrl)]
    ).filter((url): url is string => Boolean(url))
    return {
      id: row.id,
      slug: row.slug,
      name: localizedValue(row.name as LocalizedText, locale),
      summary: localizedValue(row.summary as LocalizedText | null, locale),
      description: localizedValue(
        row.description as LocalizedText | null,
        locale,
      ),
      botanicalName: row.botanicalName ?? '',
      originRegions: (row.originRegions as string[] | null) ?? [],
      specs: (row.specs as ProductSpec[] | null) ?? [],
      harvestMonths: (row.harvestMonths as number[] | null) ?? [],
      peakMonths: (row.peakMonths as number[] | null) ?? [],
      imageUrl: optimizedImageUrl(row.imageUrl),
      images: galleryUrls,
      categorySlug: row.category.slug,
      categoryName: localizedValue(row.category.name as LocalizedText, locale),
    }
  },
  ['getPublishedProductBySlug'],
  { tags: [PRODUCTS_TAG] },
)

/**
 * "Pairs naturally" — other published products, preferring the same category as
 * `excludeSlug`, falling back to recent products to fill the limit (mirrors
 * listRelatedArticles). Cached + tagged with PRODUCTS_TAG.
 */
export const listRelatedProducts = unstable_cache(
  async (
    excludeSlug: string,
    locale: Locale,
    limit = 3,
  ): Promise<ProductPublicDto[]> => {
    const source = await prisma.product.findUnique({
      where: { slug: excludeSlug },
      select: { categoryId: true },
    })

    const sameCategory = source
      ? await prisma.product.findMany({
          where: {
            isPublished: true,
            category: { isPublished: true },
            slug: { not: excludeSlug },
            categoryId: source.categoryId,
          },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
          take: limit,
        })
      : []

    const filler =
      sameCategory.length >= limit
        ? []
        : await prisma.product.findMany({
            where: {
              isPublished: true,
              category: { isPublished: true },
              slug: { not: excludeSlug },
              NOT: { id: { in: sameCategory.map((product) => product.id) } },
            },
            orderBy: [
              { categoryId: 'asc' },
              { sortOrder: 'asc' },
              { createdAt: 'asc' },
            ],
            take: limit - sameCategory.length,
          })

    return [...sameCategory, ...filler].map((product) => ({
      id: product.id,
      slug: product.slug,
      name: localizedValue(product.name as LocalizedText, locale),
      summary: localizedValue(product.summary as LocalizedText | null, locale),
      imageUrl: optimizedImageUrl(product.imageUrl),
    }))
  },
  ['listRelatedProducts'],
  { tags: [PRODUCTS_TAG] },
)
