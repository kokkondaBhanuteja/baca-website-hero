# messages/ + i18n/ — Localization (next-intl v4)

Static UI/marketing copy for the public site. **22 locales**: `en` (default), `ar` (RTL), `de`, `fr`,
`es`, `nl`, `it`, `zh` (Simplified), `ja`, `ko`, `th`, `vi`, `id`, `pt-BR`, `bg`, `hu`, `nb`, `pl`, `ro`,
`ru`, `tr`, `uk`. One JSON file per locale, top-level **namespace per page/section**. (DB content —
products, articles, gallery — is localized separately via JSONB; see prisma/CLAUDE.md.)

Script-specific fonts are loaded in `app/(site)/[locale]/layout.tsx` via `next/font`
(Noto Sans Arabic, SC, JP, KR, Thai; Inter extended with Cyrillic) and routed through
`[lang='..']` blocks in `app/globals.css` so each script renders in the brand-matching face
without other locales paying the download cost.

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

1. Add/edit the key in **all 22** `messages/<locale>.json` (same path in each). 2. Reference it via the namespace.
2. Keep parity. Proper nouns (BACA, ISO 22000, HACCP, FSSAI, APEDA, grade codes, GST/IEC, email) stay
   untranslated in every locale. Long-form bodies may be English-now with other locales falling back.

## Adding a locale

Add it to `LOCALES` in `constants/i18n.ts` + `LOCALE_META`, create `messages/<locale>.json` with the full key tree.
That's it — routing, `<html lang dir>`, and the switcher derive from those two. If the locale uses a
non-Latin script not already loaded (i.e., not Latin/Arabic/CJK/Thai/Cyrillic), also: load the relevant
`Noto_Sans_*` family in `app/(site)/[locale]/layout.tsx` and add a `[lang='<code>']` override block in
`app/globals.css` mapping `--font-{heading,display,sans,mono}` to the new family.
