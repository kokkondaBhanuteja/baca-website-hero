# Blogs page redesign — admin-managed blog types + instant filtering

**Date:** 2026-06-21
**Status:** Approved (design)

## Goal

Turn the public Insights page into a **Blogs** page in the spirit of
`tirraorigins.com/blogs`: users filter articles by **type**, where the types are
**defined by admins** (not a hardcoded enum). Rename all user-facing "Insights"
copy to "Blogs". Remove the custom magnetic cursor (use the native arrow).
Reseed with real-world, structured, filterable blog content.

## Decisions (locked)

- **Blog types are admin-managed** — a DB table the admin can CRUD, mirroring the
  existing `ProductCategory` ↔ `Product` pattern.
- **Default seed types (4):** Industry Insights, Origin Stories, Recipes & Uses,
  Sustainability. Admin can rename/add/delete later.
- **Filter UX:** instant client-side pill bar (`All` + each type) — filters the
  already-loaded list with no page reload.
- **Layout:** uniform 3-column grid; featured articles get a badge (no hero card).
- **Seed volume:** ~12 articles (3 per type), real titles/excerpts/bodies.

## 1. Data model (Prisma)

Replace the `BlogCategory` enum with an admin-managed table.

- **New model `BlogType`** (mirrors `ProductCategory`, minus image fields):
  - `id` cuid, `slug` String @unique, `name` Json (LocalizedText; `en` required via zod),
    `sortOrder` Int @default(0), `isPublished` Boolean @default(true),
    `articles BlogArticle[]`, `createdAt`, `updatedAt`.
  - `@@index([sortOrder])`, `@@map("blog_types")`.
- **`BlogArticle`**: remove `category BlogCategory`; add
  `blogTypeId String` + `blogType BlogType @relation(fields: [blogTypeId], references: [id], onDelete: Restrict)`.
  Replace `@@index([category])` with `@@index([blogTypeId])`.
- **Delete** the `BlogCategory` enum.
- Migration: `pnpm prisma migrate dev --name blog_types_table`. Seed wipes &
  recreates articles, so reset/reseed rather than data-migrating old rows.

## 2. Backend

- **`lib/server/services/blog-type-service/`** (mirror `category-service`):
  `BLOG_TYPES_TAG`, `listAllBlogTypesForAdmin()`, `listBlogTypesForAdmin()` (paginated),
  `listPublishedBlogTypes(locale)` (tagged `unstable_cache`), `getBlogTypeById`,
  `createBlogType`, `updateBlogType`, `deleteBlogType` (Restrict guard surfaces a
  conflict error when articles reference it). `revalidateTag(BLOG_TYPES_TAG, 'max')`
  plus `BLOG_ARTICLES_TAG` on mutation.
- **`lib/server/validation/blog-type-schema.ts`** (zod): name (LocalizedText, `en` required),
  slug, sortOrder, isPublished.
- **DTOs** in `lib/shared/types/blog-type-dto.ts`: `BlogTypeAdminDto`
  (raw all-locale `name`, `articleCount`), `BlogTypePublicDto` (`{ slug, name }` resolved).
- **`blog-article-service`**: swap `category` for `blogTypeId`; include `blogType`
  relation; `BlogArticleSummaryDto` carries `blogType: { slug, name }` (resolved)
  instead of the enum. Filtering by type happens client-side, so the public list
  query is unchanged except for the include.
- **`lib/shared/types/blog-dto.ts`**: remove `BlogCategoryValue` + `BLOG_CATEGORY_KEY`;
  `BlogArticleSummaryDto`/`AdminDto` reference `blogType`/`blogTypeId`.
- **API** `app/api/blog-types/route.ts` (GET list + POST create) and
  `app/api/blog-types/[id]/route.ts` (GET/PATCH/DELETE) — thin handlers, `requireAdmin`,
  call the service. Each with sibling `.claude.md`.

## 3. Admin

- **New section** `app/(admin)/admin/(dashboard)/blog-types/{page,new,[id]}/page.tsx`
  - `components/blog-types-table/` + `components/blog-type-form/` (copied from
    categories; fields: localized name, slug, sortOrder, isPublished — **no image**).
    Wire into admin nav (alongside Categories).
- **`blog-article-form`**: replace the fixed-options category `Dropdown` with one
  populated from `listAllBlogTypesForAdmin()`. Custom `Dropdown` only (no native select).
  Article create/update now sends `blogTypeId`.

## 4. Public Blogs page

- **Rename "Insights" → "Blogs"** in all user-facing copy: `blogsPage.eyebrow`,
  nav label, footer, and the home section currently titled via `FeaturedInsights`
  — across all 7 locale message catalogs. Route stays `/blogs`; component/file names
  unchanged (only visible labels + message strings change).
- **`app/(site)/[locale]/blogs/page.tsx`** stays `force-dynamic`. Server loads
  `listPublishedArticles(locale)` + `listPublishedBlogTypes(locale)` and renders a new
  **client** component `BlogsFilter`.
- **`BlogsFilter`** (client): pill/tab bar `[All] [type…]`, `useState` selected slug,
  filters the already-loaded articles instantly; uniform 3-col grid of `ArticleCard`
  (moved into the client component or a shared card). Featured = badge. Per-filter
  empty state. Pills styled with brand tokens (`--saffron` active, `--line` idle).

## 5. Cursor → native arrow

- Remove `<Cursor/>` from `app/(site)/[locale]/layout.tsx`.
- Delete `components/ui/cursor/` (tsx, index, claude.md) + the folder `CLAUDE.md` entry.
- Remove `cursor: none !important` (globals.css) and the `.baca-cursor-*` /
  `.baca-has-cursor` styles so the **default arrow** shows.
- `CtaLink`'s `data-cursor` attributes become harmless no-ops; left as-is (optional cleanup).

## 6. Seed

- `prisma/seed.ts`: create the 4 default `BlogType` rows first, then ~12 articles
  (3 per type) with real titles, excerpts, multi-paragraph bodies, authors, read
  times, cover images, `blogTypeId` linked to the created types. Keep the
  wipe-then-recreate ordering (articles → types as needed).

## Out of scope

- No data migration of existing article rows (seed is source of truth).
- No URL-param/shareable filter state (client-only filtering).
- No featured hero card layout.

## Affected `.claude.md` docs (update in same change)

`prisma/CLAUDE.md`, `blogs/page.claude.md`, blog-article-service doc, new docs for
blog-type-service / schema / DTOs / API routes / admin form+table, admin nav doc,
remove cursor docs, root `CLAUDE.md` model list (BlogType added, enum removed).
