---
kind: 'page'
name: 'ProfilePage'
file: 'app/(site)/[locale]/profile/page.tsx'
exports:
  - 'generateMetadata'
  - 'ProfilePage'
  - 'default'
imports_from:
  - 'next'
  - 'next-intl/server'
  - '@/constants/i18n'
  - '@/components/shared/page-intro'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
  - '@/components/sections/profile/who-we-are'
  - '@/components/sections/profile/vision-mission'
  - '@/components/sections/profile/how-we-work'
  - '@/components/sections/profile/founders'
  - '@/components/sections/profile/why-baca'
route: '/[locale]/profile'
auth: 'Public'
---

# ProfilePage

Route: `/[locale]/profile`  
Kind: page (Next.js route convention file)  
Rendering: Server (SSG — no `force-dynamic` needed; all content is static
translations + structure constants)  
Auth: Public

Purpose:
Company profile / about page. Renders an opening `PageIntro` (eyebrow +
heading + intro lede) followed by five stacked profile sections — WhoWeAre,
VisionMission, HowWeWork, Founders, WhyBaca. Linked from the primary nav
(second item after Home) and from the footer's Company column.

Data:

- `next-intl` `getTranslations('profilePage')` for the page-level eyebrow /
  heading / intro (used in both `generateMetadata` and the `<PageIntro>`).
- Each child section pulls its own scoped namespace (`profilePage.whoWeAre`,
  `profilePage.visionMission`, …) — no prop drilling.

Business Logic:

- `setRequestLocale(locale as Locale)` so the page + its server components
  render in the right locale.
- `generateMetadata()` returns `${heading} — BACA` for `<title>` and the
  `intro` lede for `<meta description>`. Both keys live under `profilePage`
  so future copy edits land in one namespace.

Renders (top to bottom):

- `SiteHeader forceSolid` — page sits on `bg-paper`, so the header needs its
  solid treatment from the first frame.
- `<PageIntro>` inside a `max-w-content` section — eyebrow + oversized H1 +
  intro lede.
- `<WhoWeAre />`, `<VisionMission />`, `<HowWeWork />`, `<Founders />`,
  `<WhyBaca />` — composed in narrative order.
- `<SiteFooter />` — global pre-footer `ContactStrip` + dark footer.

Notes:

- Adding a sixth section: drop a new folder under
  `components/sections/profile/<name>/`, register it here, add its namespace
  under `profilePage` in all 7 `messages/*.json` files. The grouping folder's
  `CLAUDE.md` documents the conventions.
- No anchors in the URL — sections expose their own `id`s
  (`#who-we-are`, `#vision-mission`, `#how-we-work`, `#founders`, `#why-baca`)
  so future deep-links work without route changes.
