# app/ — Routing

App Router with **route groups** to support two independent root layouts. There is **no
`app/layout.tsx`** (deliberate — would force a single `<html>`).

```
app/
  (site)/[locale]/         Public localized site. (site) is a URL-invisible group.
    layout.tsx             Root <html lang dir> for public; next-intl provider; loads fonts + globals.css;
                           renders the global <Cursor/>. generateStaticParams over the 7 locales.
    page.tsx               Home (SSG, static). Composes section components from components/sections/*.
    products/page.tsx      force-dynamic. DB catalogue (category-service.getCategoriesForLocale).
    blogs/page.tsx         force-dynamic. Published articles list.
    blogs/[articleSlug]/page.tsx   force-dynamic. Article detail + related. notFound() on unknown slug.
    gallery/page.tsx       force-dynamic. Published gallery images.
    contact/page.tsx       Enquiry form (client) → POST /api/enquiry.
    _about/                Private folder (leading _) → NOT routed. Kept for future reuse.
  (admin)/admin/           Admin dashboard — see app/(admin)/admin/CLAUDE.md
  api/                     Backend route handlers — see below
```

## Conventions for pages
- `params` is a **Promise** (Next 16): `const { locale } = await params`.
- Public pages call `setRequestLocale(locale as Locale)` then `getTranslations(ns)` / a service for data.
- Locale inside a Server Component without params: `await getLocale()` (e.g. SiteHeader, FeaturedInsights).
- Inner content pages set `export const dynamic = 'force-dynamic'` (always reflect the DB).
- Internal links use the i18n `Link` from `@/i18n/navigation` (adds the locale prefix). About links scroll to
  the home section `#why-we-re-here`; section anchors live on the home (`#why-we-re-here`, `#approach`, `#compliance`).

## api/ — backend route handlers (Node runtime)
Each handler: `export const POST = handleRoute(async (request, { params }) => { … })`.
`handleRoute` (`@/lib/server/http/handle-route`) catches `HttpError`/`ZodError` → consistent JSON.
Mutations and admin reads call `await requireAdmin()` first. Public: `POST /api/enquiry` only.
```
api/auth/{login,logout,me}        JWT cookie session
api/products + /[id]              CRUD (admin)        api/categories + /[id]   CRUD (admin)
api/blog-articles + /[id]         CRUD (admin)        api/gallery + /[id]      create/list/delete (admin)
api/uploads/sign                  Cloudinary signature (admin)
api/enquiry                       POST public (contact form) · GET admin (inbox) · /[id] PATCH status
```
Route handlers are thin: validate (zod) → call a `lib/server/services/*` function → `ok()/created()/noContent()`.
