import 'server-only'

import { Prisma, type BlogArticle } from '@prisma/client'
import { revalidateTag, unstable_cache } from 'next/cache'

import type { Locale } from '@/constants/i18n'
import { destroyUploadedImage } from '@/lib/server/cloudinary/sign-upload'
import { notFoundError } from '@/lib/server/http/http-error'
import { mapPrismaError } from '@/lib/server/http/prisma-error'
import { localizedValue } from '@/lib/server/localization/localized-value'
import { prisma } from '@/lib/server/prisma'
import { optimizedImageUrl } from '@/lib/shared/cloudinary-url'
import type {
  BlogArticleAdminDto,
  BlogArticleDetailDto,
  BlogArticleSummaryDto,
} from '@/lib/shared/types/blog-dto'
import type { LocalizedText } from '@/lib/shared/types/localized-text'
import {
  ADMIN_LIST_DEFAULT_PAGE_SIZE,
  type AdminListQuery,
  type PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { BlogArticleInput } from '@/lib/server/validation/blog-article-schema'

export const BLOG_ARTICLES_TAG = 'blog-articles'

function mapAdmin(row: BlogArticle): BlogArticleAdminDto {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title as LocalizedText,
    excerpt: row.excerpt as LocalizedText,
    body: row.body as LocalizedText,
    coverImageUrl: row.coverImageUrl,
    coverImagePublicId: row.coverImagePublicId,
    authorName: row.authorName,
    authorRole: row.authorRole,
    authorAvatarUrl: row.authorAvatarUrl,
    authorAvatarPublicId: row.authorAvatarPublicId,
    readMinutes: row.readMinutes,
    status: row.status,
    featured: row.featured,
    publishedAt: row.publishedAt?.toISOString() ?? null,
  }
}

function mapSummary(row: BlogArticle, locale: Locale): BlogArticleSummaryDto {
  return {
    slug: row.slug,
    category: row.category,
    title: localizedValue(row.title as LocalizedText, locale),
    excerpt: localizedValue(row.excerpt as LocalizedText, locale),
    coverImageUrl: optimizedImageUrl(row.coverImageUrl),
    authorName: row.authorName,
    authorRole: row.authorRole,
    authorAvatarUrl: optimizedImageUrl(row.authorAvatarUrl),
    readMinutes: row.readMinutes,
    featured: row.featured,
    publishedAt: row.publishedAt?.toISOString() ?? null,
  }
}

function mapDetail(row: BlogArticle, locale: Locale): BlogArticleDetailDto {
  return {
    ...mapSummary(row, locale),
    body: localizedValue(row.body as LocalizedText, locale),
  }
}

function toData(input: BlogArticleInput, publishedAt: Date | null) {
  return {
    slug: input.slug,
    category: input.category,
    title: input.title as Prisma.InputJsonValue,
    excerpt: input.excerpt as Prisma.InputJsonValue,
    body: input.body as Prisma.InputJsonValue,
    coverImageUrl: input.coverImageUrl ?? null,
    coverImagePublicId: input.coverImagePublicId ?? null,
    authorName: input.authorName ?? null,
    authorRole: input.authorRole ?? null,
    authorAvatarUrl: input.authorAvatarUrl ?? null,
    authorAvatarPublicId: input.authorAvatarPublicId ?? null,
    readMinutes: input.readMinutes,
    status: input.status,
    featured: input.featured,
    publishedAt,
  }
}

function resolvePublishedAt(
  input: BlogArticleInput,
  existing: Date | null,
): Date | null {
  if (input.status !== 'PUBLISHED') return null
  return existing ?? new Date()
}

export async function listArticlesForAdmin({
  page = 1,
  pageSize = ADMIN_LIST_DEFAULT_PAGE_SIZE,
  search = '',
}: AdminListQuery = {}): Promise<PaginatedList<BlogArticleAdminDto>> {
  const trimmed = search.trim()
  const where: Prisma.BlogArticleWhereInput | undefined = trimmed
    ? {
        OR: [
          { slug: { contains: trimmed, mode: 'insensitive' } },
          { title: { path: ['en'], string_contains: trimmed } },
        ],
      }
    : undefined

  const [rows, total] = await Promise.all([
    prisma.blogArticle.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogArticle.count({ where }),
  ])

  return { items: rows.map(mapAdmin), total, page, pageSize }
}

export async function getArticleForAdmin(
  id: string,
): Promise<BlogArticleAdminDto> {
  const row = await prisma.blogArticle.findUnique({ where: { id } })
  if (!row) throw notFoundError('Article not found')
  return mapAdmin(row)
}

export async function createArticle(
  input: BlogArticleInput,
): Promise<BlogArticleAdminDto> {
  try {
    const row = await prisma.blogArticle.create({
      data: toData(input, resolvePublishedAt(input, null)),
    })
    revalidateTag(BLOG_ARTICLES_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function updateArticle(
  id: string,
  input: BlogArticleInput,
): Promise<BlogArticleAdminDto> {
  const existing = await prisma.blogArticle.findUnique({ where: { id } })
  if (!existing) throw notFoundError('Article not found')

  // Capture the prior publicId BEFORE the update, but DO NOT destroy yet.
  // Cloudinary destruction is irreversible; if prisma.update throws (P2002 slug
  // conflict, P2025 row gone) we'd lose the asset while the DB still references
  // its publicId. Destroy only after the update commits.
  const previousCoverPublicId =
    existing.coverImagePublicId &&
    existing.coverImagePublicId !== input.coverImagePublicId
      ? existing.coverImagePublicId
      : null
  const previousAvatarPublicId =
    existing.authorAvatarPublicId &&
    existing.authorAvatarPublicId !== input.authorAvatarPublicId
      ? existing.authorAvatarPublicId
      : null

  try {
    const row = await prisma.blogArticle.update({
      where: { id },
      data: toData(input, resolvePublishedAt(input, existing.publishedAt)),
    })
    revalidateTag(BLOG_ARTICLES_TAG, 'max')
    if (previousCoverPublicId) {
      await destroyUploadedImage(previousCoverPublicId)
    }
    if (previousAvatarPublicId) {
      await destroyUploadedImage(previousAvatarPublicId)
    }
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const row = await prisma.blogArticle.findUnique({ where: { id } })
  if (!row) throw notFoundError('Article not found')

  // Delete the DB row first; only destroy the Cloudinary asset after success.
  try {
    await prisma.blogArticle.delete({ where: { id } })
  } catch (error) {
    return mapPrismaError(error)
  }
  revalidateTag(BLOG_ARTICLES_TAG, 'max')
  if (row.coverImagePublicId) {
    await destroyUploadedImage(row.coverImagePublicId)
  }
  if (row.authorAvatarPublicId) {
    await destroyUploadedImage(row.authorAvatarPublicId)
  }
}

// ---- Public reads ----
//
// Each is wrapped in `unstable_cache` with `tags: [BLOG_ARTICLES_TAG]` so the
// matching `revalidateTag(BLOG_ARTICLES_TAG, 'max')` fired by every mutation
// actually flushes the cached entries (otherwise tag-invalidation is a no-op
// and SSG / cached consumers keep returning stale data).

export const listPublishedArticles = unstable_cache(
  async (locale: Locale): Promise<BlogArticleSummaryDto[]> => {
    const rows = await prisma.blogArticle.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    })
    return rows.map((row) => mapSummary(row, locale))
  },
  ['listPublishedArticles'],
  { tags: [BLOG_ARTICLES_TAG] },
)

export const getPublishedArticleBySlug = unstable_cache(
  async (
    slug: string,
    locale: Locale,
  ): Promise<BlogArticleDetailDto | null> => {
    // slug is a unique column → use findUnique (cheaper than findFirst).
    const row = await prisma.blogArticle.findUnique({ where: { slug } })
    if (!row || row.status !== 'PUBLISHED') return null
    return mapDetail(row, locale)
  },
  ['getPublishedArticleBySlug'],
  { tags: [BLOG_ARTICLES_TAG] },
)

export const listRelatedArticles = unstable_cache(
  async (
    excludeSlug: string,
    locale: Locale,
    limit = 3,
  ): Promise<BlogArticleSummaryDto[]> => {
    // Find the source article to anchor the "related" set on its category.
    const source = await prisma.blogArticle.findUnique({
      where: { slug: excludeSlug },
      select: { category: true },
    })

    // Prefer same-category articles first, then fall back to recent published ones.
    const sameCategory = source
      ? await prisma.blogArticle.findMany({
          where: {
            status: 'PUBLISHED',
            slug: { not: excludeSlug },
            category: source.category,
          },
          orderBy: [{ publishedAt: 'desc' }],
          take: limit,
        })
      : []

    if (sameCategory.length >= limit) {
      return sameCategory.map((row) => mapSummary(row, locale))
    }

    const filler = await prisma.blogArticle.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: excludeSlug },
        NOT: { id: { in: sameCategory.map((r) => r.id) } },
      },
      orderBy: [{ publishedAt: 'desc' }],
      take: limit - sameCategory.length,
    })

    return [...sameCategory, ...filler].map((row) => mapSummary(row, locale))
  },
  ['listRelatedArticles'],
  { tags: [BLOG_ARTICLES_TAG] },
)
