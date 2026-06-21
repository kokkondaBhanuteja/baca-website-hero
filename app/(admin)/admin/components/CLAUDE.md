# app/(admin)/admin/components/

Admin-only client components. English only — these never call next-intl. All API
calls go through the typed wrappers in `lib/api-client/endpoints/*`. **Every
component lives in its own folder** (`<name>/<name>.tsx` + `<name>/<name>.claude.md`

- `<name>/index.ts`).

```
admin-shell/                  Sidebar nav + sign-out — the dashboard frame.
admin-list-skeleton/          ONE shared placeholder used by (dashboard)/loading.tsx
                              for every admin route transition (was 5 near-identical
                              per-page loading.tsx files; consolidated 2026-06-20).
admin-list-table/             Generic search + pagination + sticky-thead client table.
                              Used via thin per-page wrappers (products-table,
                              categories-table, blog-articles-table).
products-table/               Client wrapper for the /admin/products list.
categories-table/             Client wrapper for the /admin/categories list.
blog-articles-table/          Client wrapper for the /admin/blog-articles list.
localized-text-input/         Tabbed input with one tab per locale; EN required.
spec-list-input/              Repeatable {label,value} rows for a product's specs grid (not localized).
month-picker/                 Labeled row of 12 toggle chips → month numbers (harvest / peak seasonality).
image-uploader/               Cloudinary signed upload (sign → direct upload). Single image.
multi-image-uploader/         Ordered multi-image upload (first = cover, rest = carousel); used by product-form.
product-form/                 Product create/edit form (incl. botanical/regions/specs/months editors).
category-form/                Product-category create/edit form.
blog-article-form/            Blog-article create/edit form. NOTE: local state is
                              `isFeatured` but the API payload key stays `featured`.
gallery-uploader-form/        Single-image gallery upload form.
delete-entity-button/         Confirm-then-DELETE button for any list-row entity.
```

## Patterns

- **Always Dropdown, never native `<select>`** (`@/components/ui/dropdown`).
- **Boolean state names use `is*`** (`isSaving`, `isFeatured`). `[error, setError]`
  with a `string | null` (or `Error | null`) is idiomatic and stays as-is.
- **Submit envelope.** Build payload → cast to the matching zod input type → call
  `entityApi.create / update` → on success `router.push(listRoute); router.refresh()` →
  on error read `NormalizedApiError.message` + `.fieldErrors` (keys like `name.en`).
- **Edit pages are Server Components.** They fetch the entity via `getXForAdmin(id)`
  (the raw all-locale DTO), pass it to the client form as `initial`, and `notFound()`
  on `HttpError` 404.
- **No localization here.** These components render English directly — they're part
  of the admin app, excluded from the next-intl proxy.
