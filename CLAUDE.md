# BACA — Project Guide (root)

BACA (Bharat Cargo) is a **full-stack marketing site + admin CMS** for an India-based
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
   BlogArticles, GalleryImages, Enquiries.
6. **Conventions:** descriptive names (no single-letter identifiers, even loop vars); **no `any`**
   (cast via `as Parameters<typeof t>[0]` for dynamic next-intl keys, or `as unknown as T`); custom
   `Dropdown` component everywhere (**no native `<select>`**); images use `<MediaReveal>` (GSAP scroll reveal).

## Rendering model
- **Home (`(site)/[locale]/page.tsx`) is static (SSG)**, prerendered per locale. Its header + product/insight
  sections fetch the DB at **build** → the home reflects build-time content (refreshes on rebuild/deploy).
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
