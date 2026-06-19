import 'server-only'

import { Prisma, type BlogArticle } from '@prisma/client'
import { revalidateTag } from 'next/cache'

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

export async function listArticlesForAdmin(): Promise<BlogArticleAdminDto[]> {
  const rows = await prisma.blogArticle.findMany({
    orderBy: [{ createdAt: 'desc' }],
  })
  return rows.map(mapAdmin)
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

  if (
    existing.coverImagePublicId &&
    existing.coverImagePublicId !== input.coverImagePublicId
  ) {
    await destroyUploadedImage(existing.coverImagePublicId)
  }

  try {
    const row = await prisma.blogArticle.update({
      where: { id },
      data: toData(input, resolvePublishedAt(input, existing.publishedAt)),
    })
    revalidateTag(BLOG_ARTICLES_TAG, 'max')
    return mapAdmin(row)
  } catch (error) {
    return mapPrismaError(error)
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const row = await prisma.blogArticle.findUnique({ where: { id } })
  if (!row) throw notFoundError('Article not found')

  await destroyUploadedImage(row.coverImagePublicId)
  await prisma.blogArticle.delete({ where: { id } })
  revalidateTag(BLOG_ARTICLES_TAG, 'max')
}

// ---- Public reads ----

export async function listPublishedArticles(
  locale: Locale,
): Promise<BlogArticleSummaryDto[]> {
  const rows = await prisma.blogArticle.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })
  return rows.map((row) => mapSummary(row, locale))
}

export async function listPublishedSlugs(): Promise<string[]> {
  const rows = await prisma.blogArticle.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return rows.map((row) => row.slug)
}

export async function getPublishedArticleBySlug(
  slug: string,
  locale: Locale,
): Promise<BlogArticleDetailDto | null> {
  const row = await prisma.blogArticle.findFirst({
    where: { slug, status: 'PUBLISHED' },
  })
  return row ? mapDetail(row, locale) : null
}

export async function listRelatedArticles(
  excludeSlug: string,
  locale: Locale,
  limit = 3,
): Promise<BlogArticleSummaryDto[]> {
  const rows = await prisma.blogArticle.findMany({
    where: { status: 'PUBLISHED', slug: { not: excludeSlug } },
    orderBy: [{ publishedAt: 'desc' }],
    take: limit,
  })
  return rows.map((row) => mapSummary(row, locale))
}
