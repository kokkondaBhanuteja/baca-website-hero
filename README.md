# BACA — Bharat Cargo

A full-stack marketing site and content-management system for **BACA**, an India-based
spice & commodity export house. A fast, multilingual public site presents the catalogue
and insights; a built-in admin dashboard manages that content; a lightweight backend
(Next.js route handlers) serves it.

## Features

- **Multilingual** — 7 locales (English, Arabic [RTL], German, French, Spanish, Dutch, Italian)
  with clean URLs (`/` for English, `/de`, `/ar`, …). UI copy is translated; database content is
  localized per-field with English fallback.
- **Admin CMS** — manage **Products & Categories**, **Blog articles** (draft / publish / featured),
  and the **Gallery**, plus an **Enquiries inbox**. Every content field has a per-locale tab.
- **Image uploads via Cloudinary** — signed, direct-to-Cloudinary uploads from the admin.
- **Secure admin** — email + password login, argon2id hashing, JWT in an httpOnly cookie.
- **Polished front-end** — a global magnetic cursor, custom dropdowns, and GSAP scroll-reveal
  imagery; full RTL support for Arabic.

## Tech stack

| Area        | Choice                                                            |
| ----------- | ----------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict) |
| Styling     | Tailwind CSS v4, GSAP, lucide-react                               |
| i18n        | next-intl v4                                                      |
| Database    | PostgreSQL (Neon in dev) + Prisma 6                               |
| Auth        | jose (JWT) + @node-rs/argon2                                      |
| Media       | Cloudinary                                                        |
| HTTP client | axios (pinned)                                                    |
| Validation  | zod 4                                                             |

## Getting started

### Prerequisites

- Node 20+ and **pnpm**
- A PostgreSQL database (a free [Neon](https://neon.tech) project works well)
- A [Cloudinary](https://cloudinary.com) account _(optional — only needed for image uploads)_

### Setup

```bash
pnpm install

# 1. Environment — copy the template and fill it in
cp .env.example .env
#   DATABASE_URL, JWT_SECRET (>=32 chars), SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD,
#   and the four CLOUDINARY_* values (cloud name also in NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME).
#   Generate a secret:  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 2. Database — apply migrations and seed starter content
pnpm prisma migrate deploy
pnpm prisma db seed            # admin user + Spices catalogue + 3 insight articles

# 3. Run
pnpm dev                       # http://localhost:3000   (admin at /admin)
```

Log into the admin at **`/admin`** with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set.
Without Cloudinary credentials the site runs fine; image upload shows a "not configured" message and
the seeded content uses local images from `public/images`.

### Scripts

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Dev server (Turbopack)               |
| `pnpm build`      | Production build (strict type-check) |
| `pnpm start`      | Run the production build             |
| `pnpm lint`       | ESLint                               |
| `pnpm db:migrate` | `prisma migrate dev`                 |
| `pnpm db:deploy`  | `prisma migrate deploy`              |
| `pnpm db:seed`    | Seed the database                    |
| `pnpm db:studio`  | Prisma Studio (browse data)          |

## Project structure

```
app/(site)/[locale]/   Public localized site        app/(admin)/admin/   Admin dashboard
app/api/               Backend route handlers
components/            ui · layout · sections · shared
lib/server/            Server-only: prisma, services, auth, cloudinary, validation
lib/api-client/        Client-only: global axios + typed endpoints
constants/  i18n/  messages/  prisma/
```

## Localization

English is the source of truth. UI strings live in `messages/<locale>.json` (one namespace per page/section);
every locale must share the same key tree. Database content stores each translatable field as a JSON object
(`{ en, de, … }`) and falls back to English when a locale is missing. To add a locale, extend `LOCALES` in
`constants/i18n.ts` and add its `messages/<locale>.json`.

## Deployment

- Designed for **Vercel** (frontend + API) with **Neon** Postgres and **Cloudinary** media.
- Set the same env vars on the host. Run `prisma migrate deploy` in the deploy/build step; `prisma generate`
  runs automatically on install.
- Public content pages render dynamically (always live); the home page is statically generated and refreshes
  on redeploy.

## Documentation

This repo ships layered **`CLAUDE.md`** files (root + per folder) describing the architecture and conventions
in technical, LLM-friendly form — start with the root `CLAUDE.md`, then the one nearest the code you're editing.

---

Private / proprietary. © BACA · Bharat Cargo.
