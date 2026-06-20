# messages/ + i18n/ — Localization (next-intl v4)

Static UI/marketing copy for the public site. **7 locales**: `en` (default), `ar` (RTL), `de`, `fr`, `es`,
`nl`, `it`. One JSON file per locale, top-level **namespace per page/section**. (DB content — products,
articles, gallery — is localized separately via JSONB; see prisma/CLAUDE.md.)

```
messages/<locale>.json   Namespaces: metadata, common, languageSwitcher, nav, header, hero, manifesto,
                         stats, productPreview, approach, certifications, globalPresence, pullQuote,
                         featuredInsights, marqueeStrip, ctaBand, footer, whatsapp,
                         productsPage, aboutPage, contactPage, blogsPage, galleryPage
i18n/routing.ts          defineRouting({ locales, defaultLocale: 'en', localePrefix: 'as-needed' })
i18n/navigation.ts       createNavigation(routing) → Link, redirect, usePathname, useRouter  (locale-aware)
i18n/request.ts          getRequestConfig → loads messages/<locale>.json
proxy.ts (repo root)     next-intl middleware; matcher excludes api|admin|_next|files
global.d.ts (repo root)  AppConfig augmentation: types Locale + Messages from en.json (typed t() keys)
```

## How it works

- `en` at `/`, others prefixed (`/de`, `/ar`, …). The locale layout sets `<html lang dir>` from `LOCALE_META`
  and `setRequestLocale(locale)`; components call `getTranslations(ns)` (server) or `useTranslations(ns)` (client).
- **`en.json` is the source of truth for types** (`global.d.ts`). Every locale must have the **exact same key
  tree** — a missing key throws `MISSING_MESSAGE` at runtime. After editing, check parity (all files same leaf count).
- **Rich text**: emphasis spans use `t.rich('headline', richTags)` with `<em>…</em>` in the string and the `em`
  renderer in `components/ui/rich.tsx`. Translators may move the `<em>` within the sentence.
- **Arrays** (e.g. `marqueeStrip.items`, `footer.marqueeItems`) read via `t.raw('items') as string[]`.
- **Dynamic keys** cast: `t(\`items.${key}.title\` as Parameters<typeof t>[0])`.

## Adding / changing a string

1. Add/edit the key in **all 7** `messages/<locale>.json` (same path in each). 2. Reference it via the namespace.
2. Keep parity. Proper nouns (BACA, Bharat Cargo, ISO 22000, HACCP, FSSAI, APEDA, grade codes, GST/IEC, email) stay
   untranslated in every locale. Long-form bodies may be English-now with other locales falling back.

## Adding a locale

Add it to `LOCALES` in `constants/i18n.ts` + `LOCALE_META`, create `messages/<locale>.json` with the full key tree.
That's it — routing, `<html lang dir>`, and the switcher derive from those two.
