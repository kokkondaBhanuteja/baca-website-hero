# lib/server/ — Backend (SERVER-ONLY)

Everything here is server-only and **must never be imported by a Client Component or by
`lib/api-client/*`**. Each module starts with `import 'server-only'` so a client import fails the build.

Two callers, one layer: **public Server Components** call these services directly; **admin route
handlers** (`app/api/*`) call the same services. The service layer is the single source of truth.

```
prisma.ts                Singleton PrismaClient (reused across hot reloads).
env.ts                   zod-parsed process.env. Parsed once on import → fails fast if a secret is missing.
                         Exports serverEnvironment + isCloudinaryConfigured.
localization/
  localized-value.ts     localizedValue(field, locale) → field[locale] ?? field.en ?? ''  (EN fallback)
http/
  http-error.ts          class HttpError(status, code, message, fieldErrors) + badRequest/unauthorized/
                         forbidden/notFoundError/conflictError helpers.
  respond.ts             ok() / created() / noContent()  (NextResponse helpers)
  handle-route.ts        Wraps a route handler; HttpError→its status, ZodError→422, else 500.
  prisma-error.ts        mapPrismaError(): P2002→409 slug-in-use, P2003→400, P2025→404.
auth/
  password.ts            hashPassword / verifyPassword (argon2id)
  jwt.ts                 signSessionToken / verifySessionToken (jose, HS256, 8h, issuer 'baca-admin')
  session.ts             getCurrentAdmin() reads the 'baca_admin_session' cookie → AdminUserDto | null
  require-admin.ts       requireAdmin() → AdminUserDto or throws 401. Use in every admin route handler.
cloudinary/
  client.ts              configured cloudinary v2 (from env)
  sign-upload.ts         createUploadSignature(folder) — server-signs; UPLOAD_FOLDERS allow-list;
                         destroyUploadedImage(publicId) on delete/replace.
validation/              zod schemas (also the source of Input types via z.infer):
  localized-text-schema  requiredLocalizedText / optionalLocalizedText / slugField
  category / product / blog-article / gallery / enquiry / auth schemas
services/                business logic + DB access (the only place that touches prisma for an entity):
  category-service · product-service · blog-article-service · gallery-service ·
  enquiry-service · admin-user-service
```

## Service patterns (follow these exactly)

- **Two mappers per entity**: `mapAdmin(row)` returns raw all-locale `LocalizedText` objects (for edit forms);
  `…ForLocale(locale)` returns **resolved strings** via `localizedValue` (for public pages).
- **Writes** (create/update/delete) wrap Prisma calls in `try/catch → mapPrismaError(error)`, then
  `revalidateTag(TAG, 'max')` (Next 16 requires the 2nd profile arg). Image replace/delete →
  `destroyUploadedImage(oldPublicId)`.
- **JSONB writes**: cast localized objects to `Prisma.InputJsonValue`; for nullable JSON use
  `value ? (value as Prisma.InputJsonValue) : Prisma.DbNull`.
- **Public reads** filter `isPublished`/`status:'PUBLISHED'`, order by scalar columns, and run image URLs
  through `optimizedImageUrl` (`@/lib/shared/cloudinary-url`, adds Cloudinary `f_auto,q_auto`; leaves local paths).
- `publishedAt` for articles: set to `now` when status becomes PUBLISHED, `null` otherwise.

## Gotchas

- Prisma model types are imported as `import { type BlogArticle } from '@prisma/client'`; JSON columns come back
  as `Prisma.JsonValue` → cast `as LocalizedText` at the mapper boundary (zod guarantees the shape on write).
- `revalidateTag(tag)` alone throws in Next 16 — always pass a profile (`'max'`).
- Never put anything you need to filter/sort by inside a JSONB field.

## Recipe: add a CMS entity end-to-end

The codebase repeats one pattern (Products/Articles/Gallery are all built this way). To add `Thing`:

1. **Schema** — model in `prisma/schema.prisma` (translatable text as `Json`, scalar `slug`/`status`/`sortOrder`,
   image as `imageUrl` + `imagePublicId`); `pnpm prisma migrate dev --name add_thing`.
2. **DTOs** — `lib/shared/types/thing-dto.ts`: `ThingAdminDto` (raw `LocalizedText`) + `ThingPublicDto` (resolved).
3. **Validation** — `lib/server/validation/thing-schema.ts` using `requiredLocalizedText`/`slugField`; export
   `ThingInput = z.infer<…>`.
4. **Service** — `lib/server/services/thing-service.ts`: `mapAdmin` + `mapForLocale`, `list/get/create/update/delete`
   (writes wrap `mapPrismaError` + `revalidateTag('thing','max')`, image replace → `destroyUploadedImage`), and a
   public `listPublishedThings(locale)`.
5. **API** — `app/api/thing/route.ts` (GET list + POST) and `app/api/thing/[id]/route.ts` (GET/PATCH/DELETE);
   each wrapped in `handleRoute`, `await requireAdmin()`, zod-parse the body.
6. **Client endpoint** — `lib/api-client/endpoints/thing-api.ts` (typed axios wrappers).
7. **Admin** — `app/(admin)/admin/(dashboard)/thing/{page,new/page,[id]/page}.tsx` + a `thing-form.tsx`
   (uses `LocalizedTextInput`, `ImageUploader`, custom `Dropdown`); add to `admin-shell` nav and the
   `delete-entity-button` kinds.
8. **Public** — a Server Component reading `…ForLocale(await getLocale())`; add its chrome to **all 7**
   `messages/<locale>.json`.
