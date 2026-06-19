# constants/

Static, non-translatable structure and configuration. Text that users see lives in `messages/`
(static copy) or the DB (catalogue/insights) — **not here**. Constants hold hrefs, enums, ids,
icon refs, brand identifiers, and per-section layout structure that joins to message keys.

```
i18n.ts          LOCALES tuple (as const), Locale union, DEFAULT_LOCALE, LOCALE_META { label, native, dir, hreflang }.
                 Single source of truth for locales — imported by i18n/routing.ts, the layout, the switcher.
routes.ts        Route enum (canonical hrefs, no locale prefix) + Anchor enum (in-page #fragments).
site.ts          SITE { brand, sub, founded, gst, iec, address } + CERT_MARKS. Proper nouns — never translated.
contact.ts       CONTACT { email, phone, whatsapp } (literal identifiers).
sections/        Per-section structure paired with message keys (or DB), e.g.:
  nav.ts         NAV items (key + href). Top-level only now; the header builds Products/Insights dropdowns
                 from the DB at runtime.
  footer.ts      FOOTER_COLUMNS (key + href). Links point to live routes / home anchors only.
  commitments.ts ABOUT_COMMITMENTS keys (join to aboutPage.commitments.<key>).
  products.ts / insights.ts   Legacy static-content configs from before those sections became DB-driven;
                 the live home sections now read the DB, so treat these as historical unless re-used.
```

## Rules
- A constant value that's user-visible text and should change per language does **not** belong here —
  put it in `messages/`.
- `LOCALES` must stay `as const` so `Locale` narrows to the literal union.
- Route/Anchor enums are the canonical internal links; compose anchors as `` `${Route.Home}#why-we-re-here` ``.
