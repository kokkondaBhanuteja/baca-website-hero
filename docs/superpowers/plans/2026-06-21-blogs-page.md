# Blogs Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the public "Insights" page into a **Blogs** page where articles are filtered (instantly, client-side) by **admin-defined blog types** stored in a DB table; rename all user-facing "Insights" copy to "Blogs"; remove the custom magnetic cursor (use the native arrow); reseed with real structured articles.

**Architecture:** Introduce a new `BlogType` model mirroring the existing `ProductCategory ↔ Product` pattern. `BlogArticle.category` (enum) becomes `blogTypeId` (FK, `onDelete: Restrict`). A new `blog-type-service` + API routes + admin CRUD section manage types. The public `/blogs` page stays `force-dynamic`, loads articles + published types server-side, and renders a new client `BlogsFilter` component (pill bar + uniform grid).

**Tech Stack:** Next.js 16.2 App Router, React 19, TypeScript strict, Prisma 6.19 + PostgreSQL (Neon), next-intl v4 (7 locales), Tailwind v4, zod 4, axios (client-only).

## Global Constraints

- **No unit-test harness exists.** Per-task verification is `pnpm typecheck` (tsc --noEmit), `pnpm lint` (eslint), and where noted `pnpm build` / seed / dev-server checks. Do NOT invent a test runner.
- **TypeScript strict, `ignoreBuildErrors: false`** — build fails on any type error. **No `any`** (cast via `as unknown as T` or `as Parameters<typeof t>[0]`).
- **Server/client boundary is compiler-enforced:** `lib/server/*` files start with `import 'server-only'`; client API wrappers use the axios instance (`import 'client-only'`). A Server Component must never import axios; a Client Component must never import a service/prisma.
- **Custom `Dropdown` everywhere — never native `<select>`.** Images use `<MediaReveal>`.
- **Descriptive names**, no single-letter identifiers except the sanctioned `const t = useTranslations(ns)` / `await getTranslations(ns)`.
- **Localized DB text = JSONB** `{ en, … }`, `en` required (enforced by zod). Read via `localizedValue(field, locale)`. Routing/sort/filter keys stay scalar columns.
- **Per-component folder + sibling `.claude.md` + `index.ts` barrel.** Creating a component requires folder + barrel + `.claude.md`. After editing a `.tsx`/`.ts`, update its sibling `.claude.md` if exports/deps/logic/route/auth changed.
- **Neon is the dev DB.** Running `prisma migrate` / `db seed` hits the remote DB — **confirm with the user before running those commands.**
- Default seed types (4): **Industry Insights, Origin Stories, Recipes & Uses, Sustainability**. Seed ~12 articles (3 per type).
- Mutations call `revalidateTag(TAG, 'max')`. Admin reads/mutations call `await requireAdmin()` first.

---

## File Structure

**New files:**

- `lib/shared/types/blog-type-dto.ts` — `BlogTypeAdminDto`, `BlogTypePublicDto`
- `lib/server/validation/blog-type-schema/blog-type-schema.ts` (+ `.claude.md`)
- `lib/server/services/blog-type-service/blog-type-service.ts` (+ `index.ts`, `.claude.md`)
- `lib/api-client/endpoints/blog-types-api/blog-types-api.ts` (+ `index.ts`)
- `app/api/blog-types/route.ts` (+ `.claude.md`), `app/api/blog-types/[id]/route.ts` (+ `.claude.md`)
- `app/(admin)/admin/(dashboard)/blog-types/page.tsx`, `new/page.tsx`, `[id]/page.tsx`
- `app/(admin)/admin/components/blog-types-table/blog-types-table.tsx` (+ `index.ts`)
- `app/(admin)/admin/components/blog-type-form/blog-type-form.tsx` (+ `index.ts`)
- `app/(site)/[locale]/blogs/blogs-filter/blogs-filter.tsx` (+ `index.ts`, `.claude.md`)

**Modified files:**

- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/CLAUDE.md`
- `lib/shared/types/blog-dto.ts`
- `lib/server/validation/blog-article-schema/blog-article-schema.ts`
- `lib/server/services/blog-article-service/blog-article-service.ts` (+ `.claude.md`)
- `lib/api-client/endpoints/blog-types-api` wired into `delete-entity-button.tsx`
- `app/(admin)/admin/components/blog-article-form/blog-article-form.tsx`
- `app/(admin)/admin/components/blog-articles-table/blog-articles-table.tsx`
- `app/(admin)/admin/(dashboard)/blog-articles/new/page.tsx`, `[id]/page.tsx`
- `app/(admin)/admin/components/admin-shell/admin-shell.tsx` (nav item)
- `app/(site)/[locale]/blogs/page.tsx`, `blogs/[articleSlug]/page.tsx`
- `components/sections/featured-insights/featured-insights.tsx`
- `messages/{en,de,fr,es,nl,it,ar}.json`
- `app/(site)/[locale]/layout.tsx`, `app/globals.css`, root + folder `CLAUDE.md` docs
- Delete: `components/ui/cursor/` folder

---

## Task 1: Prisma — BlogType model, BlogArticle FK, drop enum, migrate

**Files:**

- Modify: `prisma/schema.prisma`

**Interfaces:**

- Produces: Prisma models `BlogType { id, slug, name(Json), sortOrder, isPublished, articles, createdAt, updatedAt }` and `BlogArticle.blogTypeId: string` + `BlogArticle.blogType: BlogType`. Removes `BlogCategory` enum and `BlogArticle.category`.

- [ ] **Step 1: Remove the `BlogCategory` enum block** (`prisma/schema.prisma:21-25`):

```prisma
enum BlogCategory {
  INDUSTRY_INSIGHTS
  IMPACT_STORIES
  COMMUNITY_ENGAGEMENT
}
```

Delete it entirely.

- [ ] **Step 2: Add the `BlogType` model** (place it directly above `model BlogArticle`):

```prisma
model BlogType {
  id          String        @id @default(cuid())
  slug        String        @unique
  name        Json // LocalizedText
  sortOrder   Int           @default(0)
  isPublished Boolean       @default(true)
  articles    BlogArticle[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([sortOrder])
  @@map("blog_types")
}
```

- [ ] **Step 3: Rewrite `BlogArticle`'s category field + index.** In `model BlogArticle`, replace the line `category BlogCategory` with:

```prisma
  blogTypeId           String
  blogType             BlogType      @relation(fields: [blogTypeId], references: [id], onDelete: Restrict)
```

And replace `@@index([category])` with `@@index([blogTypeId])`. Leave all other fields unchanged.

- [ ] **Step 4: Validate the schema**

Run: `pnpm prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`

- [ ] **Step 5: Empty the blog_articles table so the required FK column can be added** (seed owns these rows; confirm with user before touching Neon)

Run: `echo "DELETE FROM blog_articles;" | pnpm prisma db execute --stdin`
Expected: command succeeds (no rows error). This lets `migrate dev` add the non-null `blogTypeId` to an empty table.

- [ ] **Step 6: Create + apply the migration**

Run: `pnpm prisma migrate dev --name blog_types_table`
Expected: migration created under `prisma/migrations/<ts>_blog_types_table/`, applied, and `prisma generate` runs. The `@prisma/client` now exposes `prisma.blogType` and `BlogArticle.blogTypeId`.

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(prisma): add admin-managed BlogType model; BlogArticle.category -> blogTypeId FK"
```

---

## Task 2: Shared DTOs + zod schema for BlogType

**Files:**

- Create: `lib/shared/types/blog-type-dto.ts`
- Create: `lib/server/validation/blog-type-schema/blog-type-schema.ts`
- Create: `lib/server/validation/blog-type-schema/blog-type-schema.claude.md`

**Interfaces:**

- Produces: `BlogTypeAdminDto`, `BlogTypePublicDto`, `blogTypeInputSchema`, `BlogTypeInput`.
- Consumes: `LocalizedText` from `lib/shared/types/localized-text`; `requiredLocalizedText`, `slugField` from `lib/server/validation/localized-text-schema`.

- [ ] **Step 1: Write the DTOs** — `lib/shared/types/blog-type-dto.ts`:

```typescript
import type { LocalizedText } from './localized-text'

/** Admin view — raw all-locale name + article count for the table. */
export interface BlogTypeAdminDto {
  id: string
  slug: string
  name: LocalizedText
  sortOrder: number
  isPublished: boolean
  articleCount: number
}

/** Public filter pill — resolved name for the active locale. */
export interface BlogTypePublicDto {
  slug: string
  name: string
}
```

- [ ] **Step 2: Write the zod schema** — `lib/server/validation/blog-type-schema/blog-type-schema.ts`:

```typescript
import { z } from 'zod'

import {
  requiredLocalizedText,
  slugField,
} from '@/lib/server/validation/localized-text-schema'

export const blogTypeInputSchema = z
  .object({
    slug: slugField,
    name: requiredLocalizedText,
    sortOrder: z.number().int().min(0).max(10000).default(0),
    isPublished: z.boolean().default(true),
  })
  .strict()

export type BlogTypeInput = z.infer<typeof blogTypeInputSchema>
```

- [ ] **Step 3: Write the `.claude.md`** — `lib/server/validation/blog-type-schema/blog-type-schema.claude.md`:

```markdown
---
kind: 'validation'
name: 'blog-type-schema'
file: 'lib/server/validation/blog-type-schema/blog-type-schema.ts'
exports:
  - 'blogTypeInputSchema'
  - 'BlogTypeInput'
imports_from:
  - 'zod'
  - '@/lib/server/validation/localized-text-schema'
---

# blog-type-schema

Purpose: zod schema validating admin create/update of a blog type.

Business Logic:

- slug (slugField), name (requiredLocalizedText — `en` required), sortOrder (0–10000, default 0), isPublished (default true). `.strict()` rejects unknown keys.

Used In: `app/api/blog-types/route.ts`, `app/api/blog-types/[id]/route.ts`, `blog-type-service`, `blog-type-form`.
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS (no errors from the new files).

- [ ] **Step 5: Commit**

```bash
git add lib/shared/types/blog-type-dto.ts lib/server/validation/blog-type-schema
git commit -m "feat(types): BlogType DTOs + zod input schema"
```

---

## Task 3: blog-type-service

**Files:**

- Create: `lib/server/services/blog-type-service/blog-type-service.ts`
- Create: `lib/server/services/blog-type-service/index.ts`
- Create: `lib/server/services/blog-type-service/blog-type-service.claude.md`

**Interfaces:**

- Consumes: `blogTypeInputSchema`/`BlogTypeInput` (Task 2), `BlogTypeAdminDto`/`BlogTypePublicDto` (Task 2), `BLOG_ARTICLES_TAG` from `blog-article-service`.
- Produces: `BLOG_TYPES_TAG`, `listAllBlogTypesForAdmin()`, `listBlogTypesForAdmin(query)`, `getBlogTypeForAdmin(id)`, `createBlogType(input)`, `updateBlogType(id, input)`, `deleteBlogType(id)`, `listPublishedBlogTypes(locale)`.

- [ ] **Step 1: Write the service** — `lib/server/services/blog-type-service/blog-type-service.ts`:

```typescript
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
```

- [ ] **Step 2: Write the barrel** — `lib/server/services/blog-type-service/index.ts`:

```typescript
export * from './blog-type-service'
```

- [ ] **Step 3: Write the `.claude.md`** — `lib/server/services/blog-type-service/blog-type-service.claude.md`:

```markdown
---
kind: 'service'
name: 'blog-type-service'
file: 'lib/server/services/blog-type-service/blog-type-service.ts'
exports:
  - 'BLOG_TYPES_TAG'
  - 'listAllBlogTypesForAdmin'
  - 'listBlogTypesForAdmin'
  - 'getBlogTypeForAdmin'
  - 'createBlogType'
  - 'updateBlogType'
  - 'deleteBlogType'
  - 'listPublishedBlogTypes'
imports_from:
  - 'server-only'
  - '@prisma/client'
  - 'next/cache'
  - '@/lib/server/http/http-error'
  - '@/lib/server/http/prisma-error'
  - '@/lib/server/localization/localized-value'
  - '@/lib/server/prisma'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/shared/types/blog-type-dto'
  - '@/lib/server/validation/blog-type-schema/blog-type-schema'
called_by:
  - 'app/api/blog-types/route.ts'
  - 'app/api/blog-types/[id]/route.ts'
  - 'app/(site)/[locale]/blogs/page.tsx'
  - 'app/(admin)/admin/(dashboard)/blog-types/*'
  - 'blog-article-form admin pages (listAllBlogTypesForAdmin)'
auth: 'admin reads/writes via API requireAdmin; listPublishedBlogTypes is public'
---

# blog-type-service

Admin-managed blog types (mirrors category-service, minus images). CRUD +
paginated/non-paginated admin reads + `listPublishedBlogTypes(locale)` (tagged
`unstable_cache`). `deleteBlogType` refuses when articles reference the type
(`onDelete: Restrict` + explicit count guard → conflictError). Mutations
revalidate `BLOG_TYPES_TAG` and `BLOG_ARTICLES_TAG` (a renamed type changes
article cards/pills).
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS. (Note: `BLOG_ARTICLES_TAG` import resolves — it already exists in blog-article-service.)

- [ ] **Step 5: Commit**

```bash
git add lib/server/services/blog-type-service
git commit -m "feat(service): blog-type-service CRUD + published-types read"
```

---

## Task 4: API routes for blog-types

**Files:**

- Create: `app/api/blog-types/route.ts` (+ `route.claude.md`)
- Create: `app/api/blog-types/[id]/route.ts` (+ `route.claude.md`)

**Interfaces:**

- Consumes: blog-type-service functions (Task 3), `blogTypeInputSchema` (Task 2), `requireAdmin`, `handleRoute`, `parseAdminListQuery`, `created`/`ok`/`noContent`.

- [ ] **Step 1: Write the collection route** — `app/api/blog-types/route.ts`:

```typescript
import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { parseAdminListQuery } from '@/lib/server/http/parse-admin-list-query'
import { created, ok } from '@/lib/server/http/respond'
import {
  createBlogType,
  listBlogTypesForAdmin,
} from '@/lib/server/services/blog-type-service'
import { blogTypeInputSchema } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

export const GET = handleRoute(async (request) => {
  await requireAdmin()
  return ok(await listBlogTypesForAdmin(parseAdminListQuery(request)))
})

export const POST = handleRoute(async (request) => {
  await requireAdmin()
  const input = blogTypeInputSchema.parse(await request.json())
  return created(await createBlogType(input))
})
```

- [ ] **Step 2: Write the item route** — `app/api/blog-types/[id]/route.ts`:

```typescript
import { requireAdmin } from '@/lib/server/auth/require-admin'
import { handleRoute } from '@/lib/server/http/handle-route'
import { noContent, ok } from '@/lib/server/http/respond'
import {
  deleteBlogType,
  getBlogTypeForAdmin,
  updateBlogType,
} from '@/lib/server/services/blog-type-service'
import { blogTypeInputSchema } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

export const GET = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  return ok(await getBlogTypeForAdmin(id))
})

export const PATCH = handleRoute(async (request, { params }) => {
  await requireAdmin()
  const { id } = await params
  const input = blogTypeInputSchema.parse(await request.json())
  return ok(await updateBlogType(id, input))
})

export const DELETE = handleRoute(async (_request, { params }) => {
  await requireAdmin()
  const { id } = await params
  await deleteBlogType(id)
  return noContent()
})
```

- [ ] **Step 3: Write both `.claude.md` docs.** `app/api/blog-types/route.claude.md`:

```markdown
---
kind: 'api-route'
name: 'blog-types-collection'
file: 'app/api/blog-types/route.ts'
route: '/api/blog-types'
methods: ['GET', 'POST']
auth: 'requireAdmin'
exports: ['GET', 'POST']
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/parse-admin-list-query'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/blog-type-service'
  - '@/lib/server/validation/blog-type-schema/blog-type-schema'
---

# blog-types collection route

GET (paginated admin list) + POST (create). Both `requireAdmin`. Thin: validate
with `blogTypeInputSchema` → service → `created`/`ok`.
```

`app/api/blog-types/[id]/route.claude.md`:

```markdown
---
kind: 'api-route'
name: 'blog-types-item'
file: 'app/api/blog-types/[id]/route.ts'
route: '/api/blog-types/[id]'
methods: ['GET', 'PATCH', 'DELETE']
auth: 'requireAdmin'
exports: ['GET', 'PATCH', 'DELETE']
imports_from:
  - '@/lib/server/auth/require-admin'
  - '@/lib/server/http/handle-route'
  - '@/lib/server/http/respond'
  - '@/lib/server/services/blog-type-service'
  - '@/lib/server/validation/blog-type-schema/blog-type-schema'
---

# blog-types item route

GET / PATCH / DELETE by id, all `requireAdmin`. DELETE surfaces a conflict when
the type still has articles (service guard + `onDelete: Restrict`).
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/blog-types
git commit -m "feat(api): blog-types CRUD route handlers"
```

---

## Task 5: api-client wrapper + wire into delete-entity-button

**Files:**

- Create: `lib/api-client/endpoints/blog-types-api/blog-types-api.ts` (+ `index.ts`)
- Modify: `app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx`

**Interfaces:**

- Consumes: `BlogTypeAdminDto` (Task 2), `BlogTypeInput` (Task 2), `apiClient`.
- Produces: `blogTypesApi` with `list/get/create/update/remove`; `DeleteEntityButton` accepts new `kind: 'blogType'`.

- [ ] **Step 1: Write the wrapper** — `lib/api-client/endpoints/blog-types-api/blog-types-api.ts`:

```typescript
import type { BlogTypeAdminDto } from '@/lib/shared/types/blog-type-dto'
import type {
  AdminListQuery,
  PaginatedList,
} from '@/lib/shared/types/paginated-list'
import type { BlogTypeInput } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

import { apiClient } from '@/lib/api-client/axios-instance'

export const blogTypesApi = {
  list: (query: AdminListQuery = {}) =>
    apiClient
      .get<PaginatedList<BlogTypeAdminDto>>('/blog-types', {
        params: {
          page: query.page,
          pageSize: query.pageSize,
          q: query.search,
        },
      })
      .then((response) => response.data),
  get: (id: string) =>
    apiClient
      .get<BlogTypeAdminDto>(`/blog-types/${id}`)
      .then((response) => response.data),
  create: (input: BlogTypeInput) =>
    apiClient
      .post<BlogTypeAdminDto>('/blog-types', input)
      .then((response) => response.data),
  update: (id: string, input: BlogTypeInput) =>
    apiClient
      .patch<BlogTypeAdminDto>(`/blog-types/${id}`, input)
      .then((response) => response.data),
  remove: (id: string) =>
    apiClient.delete(`/blog-types/${id}`).then(() => undefined),
}
```

- [ ] **Step 2: Write the barrel** — `lib/api-client/endpoints/blog-types-api/index.ts`:

```typescript
export * from './blog-types-api'
```

- [ ] **Step 3: Add `blogType` to `delete-entity-button.tsx`.** Add the import:

```typescript
import { blogTypesApi } from '@/lib/api-client/endpoints/blog-types-api'
```

Change the `EntityKind` type and `REMOVERS` map:

```typescript
type EntityKind =
  | 'category'
  | 'product'
  | 'article'
  | 'galleryImage'
  | 'blogType'

const REMOVERS: Record<EntityKind, (id: string) => Promise<unknown>> = {
  category: categoriesApi.remove,
  product: productsApi.remove,
  article: blogArticlesApi.remove,
  galleryImage: galleryApi.remove,
  blogType: blogTypesApi.remove,
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/api-client/endpoints/blog-types-api "app/(admin)/admin/components/delete-entity-button/delete-entity-button.tsx"
git commit -m "feat(api-client): blogTypesApi + delete-entity-button blogType kind"
```

---

## Task 6: Update blog-article DTOs, schema, and service (category → blogType)

**Files:**

- Modify: `lib/shared/types/blog-dto.ts`
- Modify: `lib/server/validation/blog-article-schema/blog-article-schema.ts`
- Modify: `lib/server/services/blog-article-service/blog-article-service.ts` (+ `.claude.md`)

**Interfaces:**

- Produces: `BlogArticleAdminDto` now has `blogTypeId: string` + `blogTypeName: string` (was `category`). `BlogArticleSummaryDto` now has `blogType: { slug: string; name: string }` (was `category`). `blogArticleInputSchema` now requires `blogTypeId: string`. Removes `BlogCategoryValue` + `BLOG_CATEGORY_KEY`.

- [ ] **Step 1: Edit `lib/shared/types/blog-dto.ts`.** Delete these top blocks:

```typescript
export type BlogCategoryValue =
  | 'INDUSTRY_INSIGHTS'
  | 'IMPACT_STORIES'
  | 'COMMUNITY_ENGAGEMENT'
```

and

```typescript
/** Maps the DB enum to the camelCase message key under `blogsPage.categories`. */
export const BLOG_CATEGORY_KEY: Record<BlogCategoryValue, string> = {
  INDUSTRY_INSIGHTS: 'industryInsights',
  IMPACT_STORIES: 'impactStories',
  COMMUNITY_ENGAGEMENT: 'communityEngagement',
}
```

In `BlogArticleAdminDto`, replace `category: BlogCategoryValue` with:

```typescript
blogTypeId: string
blogTypeName: string
```

In `BlogArticleSummaryDto`, replace `category: BlogCategoryValue` with:

```typescript
blogType: {
  slug: string
  name: string
}
```

(`ContentStatusValue` and the rest stay.)

- [ ] **Step 2: Edit `blog-article-schema.ts`.** Replace the `category` enum field:

```typescript
    category: z.enum([
      'INDUSTRY_INSIGHTS',
      'IMPACT_STORIES',
      'COMMUNITY_ENGAGEMENT',
    ]),
```

with:

```typescript
    blogTypeId: z.string().min(1, 'Select a blog type'),
```

- [ ] **Step 3: Edit `blog-article-service.ts` — imports + row type.** Change the prisma import line to bring in the relation payload type and update mappers. Replace:

```typescript
import { Prisma, type BlogArticle } from '@prisma/client'
```

with:

```typescript
import { Prisma } from '@prisma/client'
```

Add, just below the imports, a row type that always includes the relation:

```typescript
type ArticleRow = Prisma.BlogArticleGetPayload<{ include: { blogType: true } }>
```

- [ ] **Step 4: Update the three mappers.** Replace `mapAdmin`:

```typescript
function mapAdmin(row: ArticleRow): BlogArticleAdminDto {
  return {
    id: row.id,
    slug: row.slug,
    blogTypeId: row.blogTypeId,
    blogTypeName: (row.blogType.name as LocalizedText).en,
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
```

Replace `mapSummary` signature + category line:

```typescript
function mapSummary(row: ArticleRow, locale: Locale): BlogArticleSummaryDto {
  return {
    slug: row.slug,
    blogType: {
      slug: row.blogType.slug,
      name: localizedValue(row.blogType.name as LocalizedText, locale),
    },
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
```

Change `mapDetail`'s parameter type from `BlogArticle` to `ArticleRow`:

```typescript
function mapDetail(row: ArticleRow, locale: Locale): BlogArticleDetailDto {
```

- [ ] **Step 5: Update `toData`.** Replace `category: input.category,` with:

```typescript
    blogTypeId: input.blogTypeId,
```

- [ ] **Step 6: Add `include: { blogType: true }` to every article query.** In `listArticlesForAdmin`, the `prisma.blogArticle.findMany` call — add `include: { blogType: true },`. In `listPublishedArticles`, add `include: { blogType: true },`. In `getArticleForAdmin`, change to:

```typescript
const row = await prisma.blogArticle.findUnique({
  where: { id },
  include: { blogType: true },
})
```

In `getPublishedArticleBySlug`:

```typescript
const row = await prisma.blogArticle.findUnique({
  where: { slug },
  include: { blogType: true },
})
```

In `createArticle` and `updateArticle`, the `create`/`update` calls — add `include: { blogType: true },` alongside `data`.

- [ ] **Step 7: Fix `listRelatedArticles` (category → blogTypeId).** Replace the source select + same-category query:

```typescript
const source = await prisma.blogArticle.findUnique({
  where: { slug: excludeSlug },
  select: { blogTypeId: true },
})

const sameCategory = source
  ? await prisma.blogArticle.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: excludeSlug },
        blogTypeId: source.blogTypeId,
      },
      orderBy: [{ publishedAt: 'desc' }],
      take: limit,
      include: { blogType: true },
    })
  : []
```

And in the `filler` query add `include: { blogType: true },`.

- [ ] **Step 8: Typecheck**

Run: `pnpm typecheck`
Expected: errors ONLY in the not-yet-updated consumers (blog page, article detail, featured-insights, blog-article-form/table) — those are Tasks 7, 8, 10, 11. The service/schema/dto files themselves must be error-free. If you see errors inside `blog-article-service.ts` or `blog-dto.ts`, fix before proceeding.

- [ ] **Step 9: Update `blog-article-service.claude.md`** — change any "category" mention in Business Logic to describe the `blogType` relation include and `blogTypeId`-based related-articles logic. Update `imports_from` if changed (it no longer imports `type BlogArticle`).

- [ ] **Step 10: Commit**

```bash
git add lib/shared/types/blog-dto.ts lib/server/validation/blog-article-schema lib/server/services/blog-article-service
git commit -m "refactor(blog): article DTOs/schema/service use blogType relation"
```

---

## Task 7: Admin blog-article form + table + pages use blogTypeId

**Files:**

- Modify: `app/(admin)/admin/components/blog-article-form/blog-article-form.tsx`
- Modify: `app/(admin)/admin/components/blog-articles-table/blog-articles-table.tsx`
- Modify: `app/(admin)/admin/(dashboard)/blog-articles/new/page.tsx`
- Modify: `app/(admin)/admin/(dashboard)/blog-articles/[id]/page.tsx`

**Interfaces:**

- Consumes: `BlogTypeAdminDto` (Task 2), `listAllBlogTypesForAdmin` (Task 3), updated `BlogArticleAdminDto`/`BlogArticleInput` (Task 6).
- Produces: `BlogArticleForm` now takes a `blogTypes: BlogTypeAdminDto[]` prop and a `blogTypeId` field.

- [ ] **Step 1: Edit `blog-article-form.tsx` imports.** Replace the blog-dto import:

```typescript
import type {
  BlogArticleAdminDto,
  ContentStatusValue,
} from '@/lib/shared/types/blog-dto'
```

Add:

```typescript
import type { BlogTypeAdminDto } from '@/lib/shared/types/blog-type-dto'
```

- [ ] **Step 2: Delete the static `CATEGORY_OPTIONS` block** (the `const CATEGORY_OPTIONS: { value: BlogCategoryValue; label: string }[] = [...]`).

- [ ] **Step 3: Add `blogTypes` prop + derive options + default.** Change the component signature:

```typescript
export function BlogArticleForm({
  initial,
  blogTypes,
}: {
  initial?: BlogArticleAdminDto
  blogTypes: BlogTypeAdminDto[]
}) {
```

Just inside the component body (above the `useState`s), add:

```typescript
const blogTypeOptions = blogTypes.map((type) => ({
  value: type.id,
  label: type.name.en,
}))
```

Replace the category state:

```typescript
const [blogTypeId, setBlogTypeId] = useState<string>(
  initial?.blogTypeId ?? blogTypes[0]?.id ?? '',
)
```

- [ ] **Step 4: Update the payload.** In `handleSubmit`'s `payload`, replace `category,` with `blogTypeId,`.

- [ ] **Step 5: Replace the category Dropdown markup.** Swap the "Category" label + Dropdown block for:

```tsx
<div className="mb-4">
  <label
    className="mb-1.5 block text-sm font-medium text-ink/80"
    htmlFor="blogType"
  >
    Blog type <span className="text-clay">*</span>
  </label>
  <Dropdown
    id="blogType"
    value={blogTypeId}
    options={blogTypeOptions}
    onChange={setBlogTypeId}
    placeholder="Select a blog type…"
    buttonClassName="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink"
  />
  {fieldErrors.blogTypeId && (
    <p className="mt-1 text-xs text-clay">
      {fieldErrors.blogTypeId.join(', ')}
    </p>
  )}
</div>
```

- [ ] **Step 6: Edit `blog-articles-table.tsx`.** Replace the `formatCategory` helper:

```typescript
function formatCategory(category: BlogArticleAdminDto['category']): string {
  return category.replace(/_/g, ' ').toLowerCase()
}
```

with (no helper needed — the DTO now carries the name):

Delete that function. Then replace both `{formatCategory(article.category)}` usages (lines ~69 and ~123) with:

```tsx
{
  article.blogTypeName
}
```

If `BlogArticleAdminDto` is no longer otherwise imported, keep its existing import (it's still used for the row type).

- [ ] **Step 7: Edit `blog-articles/new/page.tsx`** to fetch types and pass them:

```tsx
import { listAllBlogTypesForAdmin } from '@/lib/server/services/blog-type-service'
import { BlogArticleForm } from '../../../components/blog-article-form'

export const dynamic = 'force-dynamic'

export default async function NewBlogArticlePage() {
  const blogTypes = await listAllBlogTypesForAdmin()
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        New article
      </h1>
      <BlogArticleForm blogTypes={blogTypes} />
    </div>
  )
}
```

(Adjust the existing heading text/wrapper to match the current file if it differs; only the data-fetch + `blogTypes` prop are required additions.)

- [ ] **Step 8: Edit `blog-articles/[id]/page.tsx`** to fetch types and pass them. After the existing article fetch, add:

```tsx
const blogTypes = await listAllBlogTypesForAdmin()
```

(import `listAllBlogTypesForAdmin` from `@/lib/server/services/blog-type-service`), and change the form render to `<BlogArticleForm initial={article} blogTypes={blogTypes} />`.

- [ ] **Step 9: Typecheck**

Run: `pnpm typecheck`
Expected: PASS for these files (public-site consumers still pending in Tasks 10/11).

- [ ] **Step 10: Commit**

```bash
git add "app/(admin)/admin/components/blog-article-form" "app/(admin)/admin/components/blog-articles-table" "app/(admin)/admin/(dashboard)/blog-articles"
git commit -m "feat(admin): article form/table use admin-defined blog types"
```

---

## Task 8: Admin blog-types CRUD section + nav

**Files:**

- Create: `app/(admin)/admin/components/blog-type-form/blog-type-form.tsx` (+ `index.ts`)
- Create: `app/(admin)/admin/components/blog-types-table/blog-types-table.tsx` (+ `index.ts`)
- Create: `app/(admin)/admin/(dashboard)/blog-types/page.tsx`, `new/page.tsx`, `[id]/page.tsx`
- Modify: `app/(admin)/admin/components/admin-shell/admin-shell.tsx`

**Interfaces:**

- Consumes: `blogTypesApi` (Task 5), `BlogTypeAdminDto`/`BlogTypeInput`, `listBlogTypesForAdmin`/`getBlogTypeForAdmin` (Task 3), `AdminListTable`/`useAdminListUrlState`, `DeleteEntityButton` (kind `blogType`), `LocalizedTextInput`/`hasAnyLocaleValue`/`LocalizedDraft`.

- [ ] **Step 1: Write `blog-type-form.tsx`** (mirrors category-form, no image):

```tsx
'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { blogTypesApi } from '@/lib/api-client/endpoints/blog-types-api'
import type { BlogTypeAdminDto } from '@/lib/shared/types/blog-type-dto'
import type { BlogTypeInput } from '@/lib/server/validation/blog-type-schema/blog-type-schema'

import {
  LocalizedTextInput,
  type LocalizedDraft,
} from '@/app/(admin)/admin/components/localized-text-input'

export function BlogTypeForm({ initial }: { initial?: BlogTypeAdminDto }) {
  const router = useRouter()
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [name, setName] = useState<LocalizedDraft>(initial?.name ?? { en: '' })
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true)

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)
    setFieldErrors({})

    const payload = { slug, name, sortOrder, isPublished } as BlogTypeInput

    try {
      if (initial) await blogTypesApi.update(initial.id, payload)
      else await blogTypesApi.create(payload)
      router.push('/admin/blog-types')
      router.refresh()
    } catch (caught) {
      const apiError = caught as NormalizedApiError
      setError(apiError.message)
      setFieldErrors(apiError.fieldErrors ?? {})
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay"
        >
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <LocalizedTextInput
              label="Name"
              required
              value={name}
              onChange={setName}
              error={fieldErrors['name.en']}
            />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
                >
                  {isSaving ? 'Saving…' : 'Save blog type'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/blog-types')}
                  className="rounded-full border border-line px-6 py-2.5 text-sm text-ink/70 hover:text-ink"
                >
                  Cancel
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm text-ink/80">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(event) => setIsPublished(event.target.checked)}
                />
                Published
              </label>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <div className="mb-4">
                <label
                  className="mb-1.5 block text-sm font-medium text-ink/80"
                  htmlFor="slug"
                >
                  Slug <span className="text-clay">*</span>
                </label>
                <input
                  id="slug"
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="recipes"
                  aria-invalid={fieldErrors.slug ? true : undefined}
                  className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                />
                {fieldErrors.slug && (
                  <p className="mt-1 text-xs text-clay">
                    {fieldErrors.slug.join(', ')}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-ink/80"
                  htmlFor="sortOrder"
                >
                  Sort order
                </label>
                <input
                  id="sortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(Number(event.target.value))}
                  className="w-28 rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  )
}
```

`index.ts`: `export * from './blog-type-form'`

- [ ] **Step 2: Write `blog-types-table.tsx`** (mirrors categories-table; Products column → Articles, `kind="blogType"`):

```tsx
'use client'

import Link from 'next/link'

import type { BlogTypeAdminDto } from '@/lib/shared/types/blog-type-dto'

import {
  AdminListTable,
  useAdminListUrlState,
} from '@/app/(admin)/admin/components/admin-list-table'
import { DeleteEntityButton } from '@/app/(admin)/admin/components/delete-entity-button'

export interface BlogTypesTableProps {
  items: BlogTypeAdminDto[]
  total: number
  page: number
  pageSize: number
  search: string
}

export function BlogTypesTable({
  items,
  total,
  page,
  pageSize,
  search,
}: BlogTypesTableProps) {
  const urlState = useAdminListUrlState({ initialSearch: search })

  return (
    <AdminListTable<BlogTypeAdminDto>
      items={items}
      total={total}
      page={page}
      pageSize={pageSize}
      {...urlState}
      minWidth={640}
      columnCount={5}
      searchPlaceholder="Search blog types by name or slug…"
      emptyMessage="No blog types yet. Create the first one."
      emptyFilteredMessage="No blog types match this search."
      header={
        <tr>
          <th className="px-5 py-3">Name (EN)</th>
          <th className="px-5 py-3">Slug</th>
          <th className="px-5 py-3">Articles</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3 text-end">Actions</th>
        </tr>
      }
      renderRow={(type) => (
        <tr key={type.id} className="border-b border-line last:border-0">
          <td className="px-5 py-3 font-medium text-ink">{type.name.en}</td>
          <td className="px-5 py-3 font-mono text-xs text-ink-60">
            {type.slug}
          </td>
          <td className="px-5 py-3 text-ink-60">{type.articleCount}</td>
          <td className="px-5 py-3">
            <span className={type.isPublished ? 'text-forest' : 'text-ink-60'}>
              {type.isPublished ? 'Published' : 'Draft'}
            </span>
          </td>
          <td className="px-5 py-3">
            <div className="flex items-center justify-end gap-4">
              <Link
                href={`/admin/blog-types/${type.id}`}
                className="text-sm text-ink/70 hover:text-ink"
              >
                Edit
              </Link>
              <DeleteEntityButton id={type.id} kind="blogType" />
            </div>
          </td>
        </tr>
      )}
      renderCard={(type) => (
        <article
          key={type.id}
          className="rounded-2xl border border-line bg-paper p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-ink">{type.name.en}</h3>
              <p className="mt-0.5 truncate font-mono text-xs text-ink-60">
                {type.slug}
              </p>
            </div>
            <span
              className={`shrink-0 text-xs ${type.isPublished ? 'text-forest' : 'text-ink-60'}`}
            >
              {type.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="mt-3 text-sm">
            <span className="font-mono text-[0.55rem] uppercase tracking-wider text-ink-60">
              Articles
            </span>
            <span className="ms-2 text-ink/80">{type.articleCount}</span>
          </p>
          <div className="mt-4 flex items-center justify-end gap-4 border-t border-line pt-3">
            <Link
              href={`/admin/blog-types/${type.id}`}
              className="text-sm text-ink/70 hover:text-ink"
            >
              Edit
            </Link>
            <DeleteEntityButton id={type.id} kind="blogType" />
          </div>
        </article>
      )}
    />
  )
}
```

`index.ts`: `export * from './blog-types-table'`

- [ ] **Step 3: Write the three dashboard pages.** `blog-types/page.tsx`:

```tsx
import Link from 'next/link'

import { listBlogTypesForAdmin } from '@/lib/server/services/blog-type-service'
import { ADMIN_LIST_DEFAULT_PAGE_SIZE } from '@/lib/shared/types/paginated-list'
import { BlogTypesTable } from '../../components/blog-types-table'

export const dynamic = 'force-dynamic'

function parsePage(raw: string | undefined): number {
  if (!raw) return 1
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export default async function BlogTypesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageRaw, q = '' } = await searchParams
  const page = parsePage(pageRaw)
  const result = await listBlogTypesForAdmin({
    page,
    pageSize: ADMIN_LIST_DEFAULT_PAGE_SIZE,
    search: q,
  })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
        <h1 className="font-heading text-2xl font-light text-ink sm:text-3xl">
          Blog types
        </h1>
        <Link
          href="/admin/blog-types/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest"
        >
          New blog type
        </Link>
      </div>

      <BlogTypesTable
        items={result.items}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        search={q}
      />
    </div>
  )
}
```

`blog-types/new/page.tsx`:

```tsx
import { BlogTypeForm } from '../../../components/blog-type-form'

export default function NewBlogTypePage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        New blog type
      </h1>
      <BlogTypeForm />
    </div>
  )
}
```

`blog-types/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'

import { getBlogTypeForAdmin } from '@/lib/server/services/blog-type-service'
import { HttpError } from '@/lib/server/http/http-error'
import { BlogTypeForm } from '../../../components/blog-type-form'

export const dynamic = 'force-dynamic'

export default async function EditBlogTypePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blogType = await getBlogTypeForAdmin(id).catch((error: unknown) => {
    if (error instanceof HttpError && error.status === 404) notFound()
    throw error
  })

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-light text-ink sm:mb-8 sm:text-3xl">
        Edit blog type
      </h1>
      <BlogTypeForm initial={blogType} />
    </div>
  )
}
```

- [ ] **Step 4: Add the nav item** in `admin-shell.tsx`. Add `Tags` (or reuse an icon) to the lucide import — use `Tag`:

```typescript
  FileText,
  Images,
  Layers,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Tag,
  X,
  type LucideIcon,
```

Insert into `NAV_ITEMS` directly after the Blog articles entry:

```typescript
  { label: 'Blog types', href: '/admin/blog-types', icon: Tag },
```

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add "app/(admin)/admin/components/blog-type-form" "app/(admin)/admin/components/blog-types-table" "app/(admin)/admin/(dashboard)/blog-types" "app/(admin)/admin/components/admin-shell/admin-shell.tsx"
git commit -m "feat(admin): blog-types CRUD section + sidebar nav"
```

---

## Task 9: Reseed — BlogType rows + ~12 structured articles

**Files:**

- Modify: `prisma/seed.ts`

**Interfaces:**

- Consumes: `prisma.blogType`, `prisma.blogArticle.blogTypeId` (Task 1).

- [ ] **Step 1: Update `wipeContent()`** to clear articles before types (FK Restrict). Replace the body:

```typescript
async function wipeContent() {
  await prisma.product.deleteMany()
  await prisma.blogArticle.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.blogType.deleteMany()
  console.log('✔ Cleared products, articles, categories, and blog types')
}
```

- [ ] **Step 2: Add a `seedBlogTypes()` function** returning a slug→id map. Place above `seedArticles`:

```typescript
const BLOG_TYPE_SEED: { slug: string; name: Record<string, string> }[] = [
  { slug: 'industry-insights', name: { en: 'Industry Insights' } },
  { slug: 'origin-stories', name: { en: 'Origin Stories' } },
  { slug: 'recipes-and-uses', name: { en: 'Recipes & Uses' } },
  { slug: 'sustainability', name: { en: 'Sustainability' } },
]

async function seedBlogTypes(): Promise<Record<string, string>> {
  const idBySlug: Record<string, string> = {}
  for (let index = 0; index < BLOG_TYPE_SEED.length; index += 1) {
    const type = BLOG_TYPE_SEED[index]
    const created = await prisma.blogType.create({
      data: {
        slug: type.slug,
        name: json(type.name),
        sortOrder: index,
        isPublished: true,
      },
    })
    idBySlug[type.slug] = created.id
  }
  console.log(`✔ Seeded ${BLOG_TYPE_SEED.length} blog types`)
  return idBySlug
}
```

- [ ] **Step 3: Change the `ArticleSeed` type** — replace `category: 'INDUSTRY_INSIGHTS' | 'IMPACT_STORIES' | 'COMMUNITY_ENGAGEMENT'` with:

```typescript
typeSlug: 'industry-insights' |
  'origin-stories' |
  'recipes-and-uses' |
  'sustainability'
```

- [ ] **Step 4: Replace `seedArticles()` signature + body** to take the id map and write 12 articles (3 per type). Use this full replacement (real structured content):

```typescript
async function seedArticles(blogTypeIdBySlug: Record<string, string>) {
  const articles: ArticleSeed[] = [
    {
      slug: 'reading-the-2026-cardamom-market',
      typeSlug: 'industry-insights',
      featured: true,
      readMinutes: 5,
      publishedAt: new Date('2026-02-04'),
      coverImageUrl: '/images/insight-1.jpg',
      authorName: 'BACA Team',
      authorRole: 'Trade desk',
      title: {
        en: 'Reading the 2026 cardamom market — small estates, new price discovery',
      },
      excerpt: {
        en: "Why this season's auctions are behaving differently, and what it means for buyers.",
      },
      body: {
        en: 'The 2026 cardamom season is being shaped by small estates rather than the large auction lots that used to set the price. Yields from the high ranges of Kerala have been uneven, and buyers who once waited for the big sales are now contracting earlier and directly.\n\nFor importers, that means two things. Price discovery is happening sooner, and the premium for documented, single-estate material is widening.\n\nWe think this is healthy. It rewards growers who invest in quality, and it gives buyers a clearer line of sight to where their spice actually comes from.',
      },
    },
    {
      slug: 'how-we-grade-cashew-for-export',
      typeSlug: 'industry-insights',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-04-05'),
      coverImageUrl: '/images/cat-nuts.jpg',
      authorName: 'BACA Team',
      authorRole: 'Trade desk',
      title: {
        en: 'How we grade cashew for export — and why W320 is only the start',
      },
      excerpt: {
        en: 'Counts, colour, breakage and moisture: a short guide to what actually goes into a cashew grade.',
      },
      body: {
        en: 'A cashew grade like W320 looks simple — "320 kernels to the pound" — but the number only tells you size. A real export grade is four things at once: count, colour, breakage and moisture.\n\nCount sets the size band. Colour separates first-quality white wholes from scorched or dessert grades. Breakage decides whether a lot ships as wholes or drops to splits and pieces. And moisture, held under 5%, is what keeps the kernel crisp.\n\nWe sort against all four before a container is sealed. It is why two lots both labelled W320 can be very different.',
      },
    },
    {
      slug: 'what-asta-colour-really-tells-you',
      typeSlug: 'industry-insights',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-05-12'),
      coverImageUrl: '/images/product-guntur-red-chilli.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
      title: { en: 'What ASTA colour really tells you about a red chilli' },
      excerpt: {
        en: 'Heat gets the headlines, but for most buyers colour is what sells the chilli.',
      },
      body: {
        en: 'Buyers talk about Scoville heat, but in practice it is ASTA colour that moves a red chilli. ASTA measures extractable colour — the pigment that survives drying and shows up in a finished sauce, oil or blend.\n\nGuntur S17 Teja sits in the 32–38 ASTA band, high enough for vivid colour without the cost of premium paprika grades. Heat and colour are not the same axis, and a good spec sheet reports both.\n\nWe grade for colour and heat separately so a buyer can match the chilli to the product, not just the heat label on the bag.',
      },
    },
    {
      slug: 'sourcing-season-with-idukki-growers',
      typeSlug: 'origin-stories',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-03-20'),
      coverImageUrl: '/images/cat-spices.jpg',
      authorName: 'BACA Team',
      authorRole: 'Sourcing',
      title: { en: 'Sourcing season with the cardamom growers of Idukki' },
      excerpt: {
        en: 'What buying directly, season after season, actually looks like on the ground in the Kerala high ranges.',
      },
      body: {
        en: 'Every cardamom season starts the same way for us: on a hillside in Idukki, with the families who have grown these capsules for generations. We do not buy through a chain of agents. We sit with growers, agree a grade and a price, and come back the next season.\n\nThat continuity changes what we can ask for. Growers who know we will return invest in better curing and cleaner picking, because the quality is rewarded directly rather than averaged away in a pooled auction lot.\n\nIt is slower than buying off the exchange, and it costs more. But it is the only way we know to put a name and a place behind every lot we ship.',
      },
    },
    {
      slug: 'the-turmeric-fields-of-erode',
      typeSlug: 'origin-stories',
      featured: false,
      readMinutes: 5,
      publishedAt: new Date('2026-04-18'),
      coverImageUrl: '/images/product-turmeric-fingers.jpg',
      authorName: 'BACA Team',
      authorRole: 'Sourcing',
      title: {
        en: 'The turmeric fields of Erode — a place that became a grade',
      },
      excerpt: {
        en: 'How one district in Tamil Nadu turned its name into a global byword for turmeric quality.',
      },
      body: {
        en: 'Say "Erode turmeric" anywhere in the trade and people know what you mean: hard, bright fingers with naturally high curcumin. The district turned its name into a grade through generations of growing and curing the same crop.\n\nWe work the Erode and Salem belts because the soil and the know-how are hard to replicate elsewhere. The fingers cure denser and hold colour without any artificial help.\n\nOrigin is not marketing here — it is the reason the lot performs.',
      },
    },
    {
      slug: 'why-malabar-pepper-carries-a-coastline',
      typeSlug: 'origin-stories',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-05-28'),
      coverImageUrl: '/images/product-malabar-black-pepper.jpg',
      authorName: 'BACA Team',
      authorRole: 'Sourcing',
      title: { en: 'Why Malabar pepper still carries the name of a coastline' },
      excerpt: {
        en: 'The pepper that gave a coast its reputation, and the bulk density that proves it.',
      },
      body: {
        en: 'The Malabar coast gave black pepper its name long before bulk density was a spec line. Today that heritage shows up as a number: 550–570 g/l, the density that tells a buyer the berries are dense and fully mature.\n\nGarbled Malabar pepper is cleaned to remove light and broken berries, leaving a uniform, pungent lot. The place and the grade are the same story told twice.\n\nWe buy from the Wayanad and Coorg ranges that feed that coast, and we document the density on every lot.',
      },
    },
    {
      slug: 'cardamom-three-ways-in-the-kitchen',
      typeSlug: 'recipes-and-uses',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-02-22'),
      coverImageUrl: '/images/product-green-cardamom.jpg',
      authorName: 'BACA Team',
      authorRole: 'Editorial',
      title: {
        en: 'Green cardamom, three ways — from chai to slow-braised meat',
      },
      excerpt: {
        en: 'A bold Alleppey capsule is a different ingredient depending on how you open it.',
      },
      body: {
        en: 'Cardamom changes character with how you treat it. Crushed whole into simmering milk, it perfumes chai without bitterness. Ground fresh, it lifts a cake or a kheer. Bruised and dropped into a slow braise, it threads sweetness through rich meat.\n\nThe trick is to grind only what you need. The volatile oils that make a bold Alleppey capsule worth buying fade fast once the pod is opened.\n\nBuy whole, grind late, and a single grade does the work of three.',
      },
    },
    {
      slug: 'a-simple-guide-to-blooming-turmeric',
      typeSlug: 'recipes-and-uses',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-03-30'),
      coverImageUrl: '/images/insight-2.jpg',
      authorName: 'BACA Team',
      authorRole: 'Editorial',
      title: {
        en: 'A simple guide to blooming turmeric for colour and flavour',
      },
      excerpt: {
        en: 'Why a minute in hot oil changes everything turmeric does in a dish.',
      },
      body: {
        en: 'Raw turmeric stirred in at the end tastes flat and dusty. Bloomed — cooked briefly in hot oil or ghee at the start — it turns earthy, round and deeply coloured.\n\nThe heat releases the fat-soluble curcumin that carries both colour and flavour. Thirty to sixty seconds is enough; push it too far and it turns bitter.\n\nWith a high-curcumin Erode grade, a little goes a long way, so bloom gently and taste as you go.',
      },
    },
    {
      slug: 'building-a-house-blend-with-guntur-chilli',
      typeSlug: 'recipes-and-uses',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-05-02'),
      coverImageUrl: '/images/cat-spices.jpg',
      authorName: 'BACA Team',
      authorRole: 'Editorial',
      title: { en: 'Building a house chilli blend with Guntur S17' },
      excerpt: {
        en: 'How to balance heat, colour and aroma when a single chilli anchors the mix.',
      },
      body: {
        en: 'A good house blend usually leans on one workhorse chilli. Guntur S17 Teja is a fair anchor: enough heat to register, enough ASTA colour to look the part, and a clean, direct flavour that takes additions well.\n\nStart with Guntur for the base, add a milder, high-colour chilli to deepen the red, and finish with a small aromatic note — a little roasted cumin or coriander.\n\nGrade matters here: stemless, low-moisture chilli grinds cleaner and stores longer than market-grade material.',
      },
    },
    {
      slug: 'what-traceability-actually-costs',
      typeSlug: 'sustainability',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-01-28'),
      coverImageUrl: '/images/insight-3.jpg',
      authorName: 'BACA Team',
      authorRole: 'Founders',
      title: {
        en: 'What traceability actually costs — and who should pay for it',
      },
      excerpt: {
        en: 'Documenting every lot is not free. Here is where the cost goes and why we carry it.',
      },
      body: {
        en: 'Traceability sounds like a feature until you price it. Documenting every lot means grading at source, keeping records that survive an audit, and turning away material that cannot be traced.\n\nThat cost lands somewhere. We choose to carry most of it rather than push it onto growers, because the growers are the ones whose names make the documentation worth anything.\n\nThe payoff is a container whose certificate matches its contents — every time. For buyers who have been burned, that is worth paying for.',
      },
    },
    {
      slug: 'the-cost-of-cheap-turmeric',
      typeSlug: 'sustainability',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-03-02'),
      coverImageUrl: '/images/insight-2.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
      title: { en: 'The cost of cheap turmeric — and why we will not sell it' },
      excerpt: {
        en: 'Curcumin, lead-chromate adulteration, and the price of doing it properly.',
      },
      body: {
        en: 'There is always a cheaper turmeric. The question is what you are paying for when you buy it.\n\nCheap turmeric is often low in curcumin, the compound buyers actually want. Worse, some lots are brightened with lead chromate — an industrial pigment that has no business in food. It is invisible in a sample and dangerous in a kitchen.\n\nWe test every lot for curcumin content and for adulteration before it ships. It costs us margin, and it costs us volume, because we turn away material that does not pass. We think that is the right trade.',
      },
    },
    {
      slug: 'why-we-started-baca',
      typeSlug: 'sustainability',
      featured: false,
      readMinutes: 6,
      publishedAt: new Date('2026-01-15'),
      coverImageUrl: '/images/insight-3.jpg',
      authorName: 'BACA Team',
      authorRole: 'Founders',
      title: { en: 'Why we started BACA — and what we want to do differently' },
      excerpt: {
        en: 'A short note on what we think is broken about most Indian spice exports, and what we are building instead.',
      },
      body: {
        en: 'Most Indian spice exports pass through three or four hands before they reach a buyer. Each hand adds a margin and removes a little accountability. By the time a container lands, no one can tell you which farm the cardamom came from.\n\nWe started BACA to collapse that distance. We buy at origin, from the same farming families season after season. We grade at source, against ISO 22000 and HACCP, and we document every lot before it ships.\n\nThat is the whole idea: fewer hands, more traceability, and a grade in the container that matches the grade on the certificate.',
      },
    },
  ]

  for (const article of articles) {
    await prisma.blogArticle.create({
      data: {
        slug: article.slug,
        blogTypeId: blogTypeIdBySlug[article.typeSlug],
        featured: article.featured,
        readMinutes: article.readMinutes,
        status: 'PUBLISHED',
        publishedAt: article.publishedAt,
        coverImageUrl: article.coverImageUrl,
        authorName: article.authorName,
        authorRole: article.authorRole,
        title: json(article.title),
        excerpt: json(article.excerpt),
        body: json(article.body),
      },
    })
  }
  console.log(`✔ Seeded ${articles.length} blog articles`)
}
```

- [ ] **Step 5: Wire `main()`** — update the bottom orchestrator:

```typescript
async function main() {
  await seedAdminUser()
  await wipeContent()
  await seedCatalogue()
  const blogTypeIdBySlug = await seedBlogTypes()
  await seedArticles(blogTypeIdBySlug)
}
```

- [ ] **Step 6: Run the seed** (confirm with the user — hits Neon)

Run: `pnpm db:seed`
Expected: logs `✔ Seeded 4 blog types` and `✔ Seeded 12 blog articles` with no errors.

- [ ] **Step 7: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat(seed): 4 blog types + 12 structured articles linked by blogTypeId"
```

---

## Task 10: Public Blogs page + BlogsFilter client component

**Files:**

- Create: `app/(site)/[locale]/blogs/blogs-filter/blogs-filter.tsx` (+ `index.ts`, `blogs-filter.claude.md`)
- Modify: `app/(site)/[locale]/blogs/page.tsx` (+ `page.claude.md`)

**Interfaces:**

- Consumes: `BlogArticleSummaryDto` (with `blogType`), `BlogTypePublicDto`, `listPublishedArticles`, `listPublishedBlogTypes`, `Route`, i18n `Link`, `MediaReveal`.
- Produces: `BlogsFilter` client component taking `{ articles, types, labels }`.

- [ ] **Step 1: Write `blogs-filter.tsx`** (client; pill bar + uniform grid + instant filter):

```tsx
'use client'

import { useState } from 'react'

import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import type { BlogArticleSummaryDto } from '@/lib/shared/types/blog-dto'
import type { BlogTypePublicDto } from '@/lib/shared/types/blog-type-dto'
import { MediaReveal } from '@/components/ui/media-reveal'
import { cn } from '@/lib/utils'

const ALL = '__all__'

interface BlogsFilterLabels {
  all: string
  minRead: string
  featured: string
  empty: string
}

export function BlogsFilter({
  articles,
  types,
  labels,
}: {
  articles: BlogArticleSummaryDto[]
  types: BlogTypePublicDto[]
  labels: BlogsFilterLabels
}) {
  const [selected, setSelected] = useState<string>(ALL)

  const visible =
    selected === ALL
      ? articles
      : articles.filter((article) => article.blogType.slug === selected)

  const pills = [{ slug: ALL, name: labels.all }, ...types]

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label={labels.all}
        className="flex flex-wrap gap-2.5"
      >
        {pills.map((pill) => {
          const isActive = pill.slug === selected
          return (
            <button
              key={pill.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelected(pill.slug)}
              className={cn(
                'rounded-full border px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.16em] transition-colors',
                isActive
                  ? 'border-saffron bg-saffron/15 text-ink'
                  : 'border-line text-ink-60 hover:border-ink/40 hover:text-ink',
              )}
            >
              {pill.name}
            </button>
          )
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-16 text-ink-60">{labels.empty}</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-3">
          {visible.map((article) => (
            <Link
              key={article.slug}
              href={`${Route.Blogs}/${article.slug}`}
              className="group block"
            >
              <MediaReveal className="rounded-2xl border border-line">
                {article.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="aspect-[16/11] w-full object-cover transition-transform duration-baca-fast ease-baca group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="aspect-[16/11] w-full bg-bone" />
                )}
              </MediaReveal>
              <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-60">
                <span className="rounded-full border border-line px-3 py-1">
                  {article.featured ? labels.featured : article.blogType.name}
                </span>
                <span>
                  {article.readMinutes} {labels.minRead}
                </span>
              </div>
              <h2 className="mt-4 max-w-[28ch] text-balance font-heading text-xl font-light leading-snug text-ink transition-colors group-hover:text-clay">
                {article.title}
              </h2>
              <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-ink-60">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

`index.ts`: `export * from './blogs-filter'`

- [ ] **Step 2: Write `blogs-filter.claude.md`:**

```markdown
---
kind: 'component'
name: 'BlogsFilter'
file: 'app/(site)/[locale]/blogs/blogs-filter/blogs-filter.tsx'
exports: ['BlogsFilter']
imports_from:
  - 'react'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/shared/types/blog-dto'
  - '@/lib/shared/types/blog-type-dto'
  - '@/components/ui/media-reveal'
  - '@/lib/utils'
---

# BlogsFilter

Purpose: Client component for the /blogs page. Renders a pill/tab bar (All +
each published blog type) and a uniform 3-col article grid, filtering the
already-loaded `articles` instantly by `article.blogType.slug` via `useState`
(no reload). Featured articles show the "Featured" badge instead of the type.

Used In: `app/(site)/[locale]/blogs/page.tsx`.

Business Logic:

- `ALL` sentinel shows everything; otherwise filters by blogType.slug.
- Cards link to `${Route.Blogs}/${slug}`; per-filter empty state.

Dependencies: MediaReveal, i18n Link, cn.
```

- [ ] **Step 3: Rewrite `blogs/page.tsx`** to load types + delegate to BlogsFilter:

```tsx
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'
import { listPublishedArticles } from '@/lib/server/services/blog-article-service'
import { listPublishedBlogTypes } from '@/lib/server/services/blog-type-service'
import { PageIntro } from '@/components/shared/page-intro'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

import { BlogsFilter } from './blogs-filter'

export const dynamic = 'force-dynamic'

type PageParams = { params: Promise<{ locale: string }> }

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'blogsPage',
  })
  return { title: `${t('heading')} — BACA`, description: t('intro') }
}

export default async function BlogsPage({ params }: PageParams) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations('blogsPage')
  const [articles, types] = await Promise.all([
    listPublishedArticles(locale as Locale),
    listPublishedBlogTypes(locale as Locale),
  ])

  return (
    <>
      <SiteHeader forceSolid />
      <main className="min-h-screen bg-paper pt-header-base">
        <section className="mx-auto max-w-content px-5 py-[clamp(3.5rem,7vw,6rem)] sm:px-8">
          <PageIntro
            eyebrow={t('eyebrow')}
            heading={t('heading')}
            intro={t('intro')}
          />

          <BlogsFilter
            articles={articles}
            types={types}
            labels={{
              all: t('allArticles'),
              minRead: t('minRead'),
              featured: t('featured'),
              empty: t('empty'),
            }}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
```

- [ ] **Step 4: Update `blogs/page.claude.md`** — note it now also reads `listPublishedBlogTypes` and renders the `BlogsFilter` client component (pill filtering); the inline `ArticleCard` moved into BlogsFilter. Update `imports_from` accordingly (removes `MediaReveal`, `Route`, `i18n/navigation`, `BLOG_CATEGORY_KEY`; adds `blog-type-service`, `./blogs-filter`).

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS (article detail + featured-insights still pending → Task 11; if those error here that's expected and fixed next).

- [ ] **Step 6: Commit**

```bash
git add "app/(site)/[locale]/blogs/blogs-filter" "app/(site)/[locale]/blogs/page.tsx" "app/(site)/[locale]/blogs/page.claude.md"
git commit -m "feat(blogs): instant type-filter pills + uniform grid"
```

---

## Task 11: Fix remaining category consumers (article detail + featured-insights)

**Files:**

- Modify: `app/(site)/[locale]/blogs/[articleSlug]/page.tsx`
- Modify: `components/sections/featured-insights/featured-insights.tsx`

**Interfaces:**

- Consumes: `BlogArticleSummaryDto.blogType.name` (Task 6).

- [ ] **Step 1: Edit `blogs/[articleSlug]/page.tsx`.** Remove the import `import { BLOG_CATEGORY_KEY } from '@/lib/shared/types/blog-dto'`. Replace the `categoryLabel` derivation:

```typescript
const categoryLabel = t(
  `categories.${BLOG_CATEGORY_KEY[article.category]}` as Parameters<
    typeof t
  >[0],
)
```

with:

```typescript
const categoryLabel = article.blogType.name
```

(`categoryLabel` is still passed to `MediaHero`'s `eyebrow` — no other change.)

- [ ] **Step 2: Edit `featured-insights.tsx`.** Remove `import { BLOG_CATEGORY_KEY } from '@/lib/shared/types/blog-dto'`. Replace the badge expression:

```tsx
{
  article.featured
    ? tBlogs('featured')
    : tBlogs(
        `categories.${BLOG_CATEGORY_KEY[article.category]}` as Parameters<
          typeof tBlogs
        >[0],
      )
}
```

with:

```tsx
{
  article.featured ? tBlogs('featured') : article.blogType.name
}
```

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS across the whole repo now (no remaining `BLOG_CATEGORY_KEY` / `article.category` references).

- [ ] **Step 4: Verify no stale references remain**

Run: `grep -rn "BLOG_CATEGORY_KEY\|article.category\|BlogCategoryValue\|BlogCategory" app components lib --include="*.tsx" --include="*.ts"`
Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/[locale]/blogs/[articleSlug]/page.tsx" components/sections/featured-insights/featured-insights.tsx
git commit -m "refactor(blog): article detail + featured-insights use blogType.name"
```

---

## Task 12: Rename "Insights" → "Blogs" in message catalogs

**Files:**

- Modify: `messages/{en,de,fr,es,nl,it,ar}.json`

**Interfaces:**

- The keys stay the same; only display values change. Four label sites per locale: `nav.items.insights.label`, `featuredInsights.eyebrow`, `footer.columns.resources.links.insights`, `blogsPage.eyebrow`. Also remove the now-unused `blogsPage.categories` object.

- [ ] **Step 1: For `messages/en.json`**, set:
  - `nav.items.insights.label` → `"Blogs"`
  - `featuredInsights.eyebrow` → `"Blogs"`
  - `footer.columns.resources.links.insights` → `"Blogs"`
  - `blogsPage.eyebrow` → `"Blogs"`
  - Delete the `blogsPage.categories` object (`industryInsights`/`impactStories`/`communityEngagement`) — types now come from the DB.

- [ ] **Step 2: Repeat for each other locale** using the locale-appropriate word for "Blogs". Use these values:
  - `de`: `"Blogs"`
  - `fr`: `"Blogs"`
  - `es`: `"Blogs"`
  - `nl`: `"Blogs"`
  - `it`: `"Blog"`
  - `ar`: `"المدونة"`

  In each file set the same four keys to that value and delete the `blogsPage.categories` object. (If a locale's `blogsPage` lacks `categories`, skip that deletion.)

- [ ] **Step 3: Verify JSON validity + that no "Insights" label text remains in values**

Run: `node -e "for (const l of ['en','de','fr','es','nl','it','ar']) { const m=require('./messages/'+l+'.json'); if(!m.nav?.items?.insights?.label) throw new Error('missing '+l); } console.log('ok')"`
Expected: `ok`

Run: `grep -rn "\"Insights\"" messages/`
Expected: no output (the English word "Insights" no longer appears as a value; note `insights` keys remain and are fine).

- [ ] **Step 4: Commit**

```bash
git add messages
git commit -m "i18n: rename user-facing Insights -> Blogs; drop static blog categories"
```

---

## Task 13: Remove the custom cursor (native arrow)

**Files:**

- Modify: `app/(site)/[locale]/layout.tsx`
- Modify: `app/globals.css`
- Delete: `components/ui/cursor/` (folder)
- Modify: `components/ui/CLAUDE.md` (if it lists cursor)

**Interfaces:**

- Removes the `<Cursor/>` render and the global `cursor: none` override so the OS arrow shows.

- [ ] **Step 1: Edit `app/(site)/[locale]/layout.tsx`.** Remove the import line `import { Cursor } from '@/components/ui/cursor'` and remove the `<Cursor />` element (around line 107).

- [ ] **Step 2: Remove cursor CSS from `app/globals.css`.** Delete the rule containing `cursor: none !important` (around line 282) and any `.baca-cursor-dot`, `.baca-cursor-ring`, `.baca-has-cursor` rules. (Search the file for `baca-cursor` and `cursor: none` and remove those blocks.)

- [ ] **Step 3: Delete the cursor component folder**

Run: `git rm -r components/ui/cursor`
Expected: removes `cursor.tsx`, `index.ts`, `cursor.claude.md`.

- [ ] **Step 4: Remove the cursor entry from `components/ui/CLAUDE.md`** if present (the folder map line for `cursor/`).

- [ ] **Step 5: Verify nothing else imports Cursor**

Run: `grep -rn "components/ui/cursor\|<Cursor\|baca-cursor\|cursor: none" app components --include="*.tsx" --include="*.ts" --include="*.css"`
Expected: no output. (`data-cursor` attributes on CtaLink/FeaturedInsights may remain — they are inert no-ops and out of scope.)

- [ ] **Step 6: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A app/(site)/[locale]/layout.tsx app/globals.css components/ui
git commit -m "chore(ui): remove custom magnetic cursor, use native arrow"
```

---

## Task 14: Docs sync + full build verification

**Files:**

- Modify: `prisma/CLAUDE.md`, root `CLAUDE.md`, `app/(admin)/admin/CLAUDE.md` (nav), any folder maps touched.

- [ ] **Step 1: Update `prisma/CLAUDE.md`** — under Models, remove the `BlogCategory` enum mention, add `BlogType` (slug, name JSONB, sortOrder, isPublished, articles[]), and change `BlogArticle` to reference `blogTypeId` FK (onDelete Restrict) instead of the `category` enum. Update the seed description (now seeds blog types + 12 articles; wipe order articles→types).

- [ ] **Step 2: Update root `CLAUDE.md`** — in the model list line "DB = Products, Categories, BlogArticles, GalleryImages, Enquiries" add BlogTypes; note `BlogCategory` enum removed.

- [ ] **Step 3: Update `app/(admin)/admin/CLAUDE.md`** (if it enumerates nav sections / dashboard folders) to include `blog-types`.

- [ ] **Step 4: Full build**

Run: `pnpm build`
Expected: build succeeds, all 7 locales prerendered, no type errors. (Neon must be reachable; `/blogs` is force-dynamic so it is not prerendered, but the home ISR page with FeaturedInsights must compile.)

- [ ] **Step 5: Manual smoke test (dev)**

Run: `pnpm dev -- -p 4010` then check:

- `/blogs` shows the pill bar (All + 4 types) and 12 cards; clicking a pill filters instantly; native arrow cursor everywhere.
- A type with no visible match shows the empty state.
- `/admin/blog-types` lists 4 types; create/edit/delete works; deleting a type that has articles shows the conflict error.
- `/admin/blog-articles/new` shows the Blog type dropdown populated from the DB; saving an article persists `blogTypeId`.
- Header nav + footer + home insights section now read "Blogs".

- [ ] **Step 6: Commit**

```bash
git add prisma/CLAUDE.md CLAUDE.md "app/(admin)/admin/CLAUDE.md"
git commit -m "docs: sync CLAUDE.md for BlogType model + blogs rename"
```

---

## Self-Review

**Spec coverage:**

- §1 Data model → Task 1 ✓
- §2 Backend (service, schema, DTOs, blog-article-service, blog-dto, API) → Tasks 2, 3, 4, 6 ✓
- §3 Admin (blog-types section, nav, article form dropdown) → Tasks 5, 7, 8 ✓
- §4 Public page (rename + force-dynamic + BlogsFilter pills + uniform grid) → Tasks 10, 11, 12 ✓
- §5 Cursor removal → Task 13 ✓
- §6 Seed (4 types + 12 articles) → Task 9 ✓
- Docs sync → Task 14 (and per-task `.claude.md` updates) ✓

**Type consistency:**

- `BlogArticleSummaryDto.blogType: { slug, name }` defined Task 6; consumed Tasks 10 (`article.blogType.slug`/`.name`), 11 (`article.blogType.name`) ✓
- `BlogArticleAdminDto.blogTypeId`/`blogTypeName` defined Task 6; consumed Tasks 7 (form uses `blogTypeId`, table uses `blogTypeName`) ✓
- `blogTypeInputSchema` requires `blogTypeId` on articles via `blogArticleInputSchema` (Task 6); form payload sends `blogTypeId` (Task 7) ✓
- `BlogTypeAdminDto` (id, slug, name, sortOrder, isPublished, articleCount) defined Task 2; consumed Tasks 3, 7, 8 ✓
- `DeleteEntityButton kind` extended with `'blogType'` Task 5; used Task 8 ✓
- `BlogsFilter` props `{ articles, types, labels }` defined Task 10; page passes them Task 10 ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete content. Seed bodies are real prose.

**Open risk noted:** `constants/routes.ts` keeps `MarketInsights`/`ImpactStories`/`CommunityEngagement` route entries pointing at `/blogs/<old-slug>`; these are pre-existing and unused by the new flow — left as-is (out of scope).
