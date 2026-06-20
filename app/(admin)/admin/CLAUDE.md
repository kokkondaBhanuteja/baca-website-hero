# app/(admin)/admin/ — Admin dashboard

The content-management UI. **English only, NOT localized** (its own root layout, outside `[locale]`).
Excluded from the next-intl proxy. Client components talk to `app/api/*` through the global axios endpoints
(`lib/api-client/*`).

```
layout.tsx              Bare English <html> root (loads Inter + globals.css; robots noindex).
login/page.tsx          The only unguarded admin route (client form → authApi.login).
(dashboard)/
  layout.tsx            Server guard: getCurrentAdmin() → redirect('/admin/login'); renders <AdminShell>.
  page.tsx              Dashboard with live counts.
  products/ categories/ blog-articles/ gallery/ enquiries/   list + new + [id] edit screens.
components/             Admin-only client components:
  admin-shell           Sidebar nav + sign-out.
  localized-text-input  Tabbed input (a tab per locale, EN required, dot marks filled locales) → LocalizedDraft.
  image-uploader        Cloudinary signed upload (sign → direct POST to Cloudinary → returns {imageUrl, publicId}).
  category-form / product-form / blog-article-form    Entity editors.
  gallery-uploader-form / enquiry-status-control / delete-entity-button
```

## Patterns

- **Auth**: the `(dashboard)` group layout gate-keeps everything; `login` sits outside it. Sessions are the
  httpOnly cookie set by `/api/auth/login`. API guards are separate (`requireAdmin` in each handler).
- **Forms**: hold per-field local state (localized fields as `LocalizedDraft = Partial<Record<Locale,string>>`),
  build the payload, `await entityApi.create/update(payload as <Input>)`, then `router.push(list); router.refresh()`.
  On error, read `NormalizedApiError.message` + `.fieldErrors` (keys like `name.en`).
- **Selects use the custom `Dropdown`** (`@/components/ui/dropdown`) — **no native `<select>`**.
- **Edit pages** are Server Components: fetch the entity via `getXForAdmin(id)` (raw all-locale DTO), pass to the
  client form as `initial`; `notFound()` on `HttpError` 404.
- Admin reads call services directly (Server Components) or `entityApi.list()` (client) — both hit the same services.
