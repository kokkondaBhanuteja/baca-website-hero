# BACA — Project Guide (root)

BACA is a **full-stack marketing site + admin CMS** for an India-based
spice/commodity export house. A multilingual public site shows DB-driven catalogue and
insights; an admin dashboard manages that content; a small backend (Next.js route
handlers) serves it.

> This file is the global map. Most folders have their own `CLAUDE.md` with local detail —
> read the one nearest the code you're touching. Prefer these docs over reading every file.

## Stack (pinned, current)

- **Next.js 16.2** App Router + Turbopack · **React 19** · **TypeScript strict** (`ignoreBuildErrors: false`)
- **Tailwind v4** (CSS `@theme` in `app/globals.css`, no config file) · **GSAP** + Lenis · lucide-react
- **next-intl v4** — 7 locales (`en` default, `ar` RTL, `de fr es nl it`), `localePrefix: 'as-needed'`
- **Prisma 6.19** + **PostgreSQL** (Neon cloud in dev; `DATABASE_URL`)
- **Auth**: `jose` JWT in httpOnly cookie + `@node-rs/argon2` (argon2id)
- **Cloudinary** (signed uploads) · **axios 1.18.0** (exact pin, client-only) · **zod 4** validation

## Architecture in one screen

```
app/
  (site)/[locale]/   Public localized site (home, products, blogs, blogs/[slug], gallery, contact)
  (admin)/admin/     Admin dashboard (English, NOT localized, JWT-guarded)
  api/               Backend route handlers (auth, products, categories, blog-articles, gallery, uploads/sign, enquiry)
components/          ui/ (primitives) · layout/ (header,footer) · sections/ (page sections) · shared/
lib/
  server/            SERVER-ONLY: prisma, services, auth, cloudinary, validation, http helpers   (← the backend)
  api-client/        CLIENT-ONLY: the global axios instance + typed endpoint wrappers (admin uses these)
  shared/            Type-only DTOs + pure helpers, safe on both sides
constants/           Locale config, route enums, site/contact config, per-section structure configs
i18n/                next-intl routing / navigation / request config        proxy.ts = next-intl middleware
messages/            <locale>.json translation catalogs (one per locale, namespaced)
prisma/              schema.prisma + seed.ts
```

## The load-bearing rules (do not break these)

1. **Server/client boundary is compiler-enforced.** Everything in `lib/server/*` starts with
   `import 'server-only'`; `lib/api-client/axios-instance.ts` starts with `import 'client-only'`.
   A Server Component importing axios, or a Client Component importing a service/prisma, is a **build error**.
2. **Two data paths, one service layer.** Public pages (Server Components) read content by calling
   `lib/server/services/*` **directly** (in-process Prisma — no HTTP). The admin (Client Components)
   writes via `lib/api-client/*` → `app/api/*` route handlers → the same services. Never fetch your own
   `/api` from a Server Component.
3. **Two root layouts via route groups.** `app/(site)/[locale]/layout.tsx` and `app/(admin)/admin/layout.tsx`
   each render their own `<html>`. There is intentionally **no `app/layout.tsx`**. `proxy.ts` excludes
   `api`, `admin`, and static files from next-intl.
4. **Localized DB content = JSONB.** Translatable fields (product/category/article/gallery text) are stored
   as `{ en, de, … }` JSON objects (`en` required, enforced in zod). `localizedValue(field, locale)` resolves
   with English fallback. Routing/sort/filter keys stay scalar columns — never query inside JSONB.
5. **Static marketing copy lives in `messages/`** (next-intl), not the DB. DB = Products, Categories,
   BlogArticles, BlogTypes, GalleryImages, Enquiries. (Blog "types" are admin-managed rows — the
   old `BlogCategory` enum is gone; articles FK to `BlogType`.)
6. **Conventions:** descriptive names (no single-letter identifiers, even loop vars); **no `any`**
   (cast via `as Parameters<typeof t>[0]` for dynamic next-intl keys, or `as unknown as T`); custom
   `Dropdown` component everywhere (**no native `<select>`**); images use `<MediaReveal>` (GSAP scroll reveal).
   _Sanctioned exception to the single-letter rule:_ `const t = useTranslations(ns)` and
   `const t = await getTranslations(ns)` — next-intl's standard convention; keeps dotted-key lookups readable.
7. **Per-component folder + sibling `.claude.md` is the documentation convention.** Every component
   lives in its own folder: `components/<area>/<name>/<name>.tsx` + `<name>/<name>.claude.md` + `<name>/index.ts`.
   The `index.ts` barrel re-exports from the `.tsx` so imports stay `@/components/<area>/<name>`
   (no path changes when a component grows additional helper files). Each `.claude.md` follows the
   standard format: **Purpose / Used In / Business Logic / Dependencies / Impacted Modules** and starts with
   a YAML frontmatter block (`kind`, `name`, `file`, `exports`, `imports_from`, …) so agents can grep by kind.
   Each component directory also keeps a folder-level `CLAUDE.md` as a one-screen map of what's in the folder.
   Creating a new component requires creating its folder, barrel, AND `.claude.md`.

## ⚠️ Hard rule for ANY agent (Claude, Cursor, Copilot, etc.) modifying code

**Before editing a `.tsx` / `.ts` file, READ its sibling `.claude.md`** — same folder, same basename:

| You're editing                                             | Read first                                                        |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `components/ui/dropdown/dropdown.tsx`                      | `components/ui/dropdown/dropdown.claude.md`                       |
| `lib/server/services/category-service/category-service.ts` | `lib/server/services/category-service/category-service.claude.md` |
| `app/(site)/[locale]/products/page.tsx`                    | `app/(site)/[locale]/products/page.claude.md`                     |
| `app/api/products/route.ts`                                | `app/api/products/route.claude.md`                                |

The doc tells you the file's `purpose`, `exports`, `imports_from`, `called_by`, business logic, and constraints.
Skipping it is how bugs get reintroduced and load-bearing context is missed.

**After editing, UPDATE the sibling `.claude.md` in the same change** whenever ANY of the following changed:

- Exports added/removed/renamed → update frontmatter `exports:` AND the Exports list in the body.
- New external dependency → update frontmatter `imports_from:` AND the Dependencies list.
- Business logic changed (a new branch, a removed check, a new side effect) → update Business Logic bullets.
- New consumers / new caller → update `called_by:` (lib only).
- Auth posture changed (e.g. requireAdmin added) → update `auth:` field.
- Route / HTTP method / namespace changed → update `route:`, `methods:`, `i18n_namespace:`.

**Out-of-date doc is worse than no doc.** An agent reading a stale `.claude.md` will make wrong decisions
and reintroduce already-fixed bugs. Treat the `.claude.md` as part of the file, not as separate documentation.

If the change is small enough that the doc still describes it correctly, no update is needed — but always re-read
the doc to confirm. If a doc is missing, create it before merging the change.

## Rendering model

- **Home (`(site)/[locale]/page.tsx`) is ISR** — prerendered per locale with `revalidate = 3600` (1 h fallback).
  DB-driven slices (header nav dropdowns, ProductPreview, FeaturedInsights) read through `unstable_cache` +
  cache tags (`CATEGORIES_TAG`, `PRODUCTS_TAG`, `BLOG_ARTICLES_TAG`) in `lib/server/services/*`. Admin mutations
  call `revalidateTag(…, 'max')` so those sections refresh on the next request without a full redeploy.
- **Inner content pages** (`products`, `blogs`, `blogs/[slug]`, `gallery`) are **`export const dynamic = 'force-dynamic'`**
  → always live. Admin edits appear immediately there.
- Admin pages are dynamic (cookie-gated). API routes are dynamic (Node runtime — Prisma/argon2 need it).

## Local dev

```bash
pnpm install
pnpm prisma migrate deploy   # apply migrations to DATABASE_URL
pnpm prisma db seed          # admin user + Spices catalogue + 3 insight articles
pnpm dev -- -p 4010          # http://localhost:4010   (admin at /admin)
pnpm build                   # strict TS + build; expect all locales prerendered
```

`.env` (gitignored) needs: `DATABASE_URL`, `JWT_SECRET` (≥32 chars), `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`,
and the four `CLOUDINARY_*` (cloud name also in `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`). See `.env.example`.
Without Cloudinary creds, image upload shows a clear "not configured" error; seeded images are local `/public/images`.

## Design tokens (Tailwind `@theme` in app/globals.css)

`--ink` (text) · `--paper`/`--cream`/`--bone` (light surfaces) · `--saffron` (accent) · `--forest` ·
`--clay` · `--line` (borders). Fonts: Fraunces (heading), Inter (sans), JetBrains Mono (mono), Noto Sans Arabic (`[lang=ar]`).
