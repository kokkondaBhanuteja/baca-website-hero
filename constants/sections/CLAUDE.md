# constants/sections/

Per-section **structure configs** — the non-translatable scaffolding for each home/page
section. The translated copy lives in `messages/<locale>.json`; this folder defines
_what items exist_ (keys, icons, ordering) so the section component can iterate over
them and look up labels by key.

```
approach.ts         PILLARS[]            — keys + display numbers for the four approach pillars.
certifications.ts   CERTS[]              — { key, name, icon: LucideIcon, ... } for the cert grid.
footer.ts           FOOTER_COLUMNS[]     — column + link structure for the site footer.
founders.ts         FOUNDERS[]           — { key, name, imageUrl? } for the profile page's Founders grid.
nav.ts              NAV[]                — primary nav item keys + hrefs (children populated at runtime).
regions.ts          REGIONS[]            — { key, value } for the GlobalPresence stat tiles.
stats.ts            STATS[]              — { key, value, prefix, suffix } for the StatsRow tiles.
why-baca.ts         WHY_BACA[]           — { key, icon: LucideIcon } for the profile page's Why BACA grid.
```

## Pattern

Each config exports a typed array of items keyed by a stable `key` string. The matching
section component imports the array, maps over it, and calls
`t(\`items.${item.key}.label\` as Parameters<typeof t>[0])` to resolve translations.

Add a new section config here only when the section's items are intrinsic to the design
(a fixed list of pillars, columns, regions) — **not** when items are content the admin
can edit. Editable content goes through Prisma + `lib/server/services/*` (see
ProductPreview and FeaturedInsights for the DB-driven pattern).
