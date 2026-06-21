# prisma/

PostgreSQL schema + seed. Dev DB is **Neon** (cloud) via `DATABASE_URL`. ORM = **Prisma 6.19**
(not 7 — v7's adapter model was deliberately avoided).

```
schema.prisma   Models + enums (see below)
migrations/     Generated SQL migrations
seed.ts         Admin user from env (upsert) + WIPES then recreates the catalogue/insights:
                3 categories (Spices/Nuts/Fruits) · 10 products (full attributes) · 5 insight articles
                spanning all 3 blog categories. The wipe (deleteMany products→articles→categories)
                makes it the source of truth — re-running overwrites admin-made catalogue/article rows.
```

## Models

- **AdminUser** — email (unique), passwordHash (argon2id), name, role (ADMIN|SUPER_ADMIN).
- **ProductCategory** — slug (unique), `name`/`description` JSONB, imageUrl/imagePublicId, sortOrder, isPublished.
- **Product** — slug, FK categoryId (`onDelete: Restrict`), `name`/`summary`/`description` JSONB, plus
  `origin`/`specifications`/`seasonality` JSONB (detail-page attributes), image, sort, isPublished.
- **BlogArticle** — slug, `category` enum, `title`/`excerpt`/`body` JSONB, coverImage, scalar author
  byline (`authorName`/`authorRole`) + `authorAvatarUrl`/`authorAvatarPublicId`, readMinutes,
  `status` (DRAFT|PUBLISHED), featured, publishedAt.
- **GalleryImage** — `caption` JSONB?, imageUrl, imagePublicId, mediaType, sortOrder, isPublished.
- **Enquiry** — name/email/company/phone/message, localeSent, `status` (NEW|READ|ARCHIVED), createdAt.

## Localized fields = JSONB (the key design decision)

Translatable text columns are typed `Json` and hold `{ en, de, ar, … }` (`LocalizedText` in
`lib/shared/types/localized-text.ts`). **`en` is required** (enforced by zod on write, not the DB).
Read via `localizedValue(field, locale)` (EN fallback). **Never store routing/sort/filter values in JSONB** —
those are scalar columns (`slug`, `status`, `sortOrder`, `publishedAt`, `category`). Image fields store both
`imageUrl` (delivery) and `imagePublicId` (for Cloudinary transform/delete).

## Workflow

```bash
pnpm prisma migrate dev --name <change>   # dev: create + apply a migration (local DB)
pnpm prisma migrate deploy                # apply existing migrations to the target DB
pnpm prisma db seed                        # run seed.ts (idempotent)
pnpm prisma generate                       # also runs on postinstall
```

- Migrating/seeding a **remote** DB (Neon) is a real action — confirm intent before running against it.
- `seed.ts` upserts: products/articles `update` includes image fields so re-seeding refreshes seeded imagery
  (note: it will overwrite admin-set images for those seeded slugs).
