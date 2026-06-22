---
kind: 'page'
name: 'BlogArticlePage'
file: 'app/(site)/[locale]/blogs/[articleSlug]/page.tsx'
exports:
  - 'generateMetadata'
  - 'dynamic'
  - 'BlogArticlePage'
  - 'default'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - 'next/navigation'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/utils'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/server/services/blog-type-service'
  - '@/lib/shared/format-date'
  - '@/components/ui/media-reveal'
  - '@/components/shared/markdown-content'
  - '@/components/layout/site-header'
  - '@/components/layout/site-footer'
route: '/[locale]/blogs/[articleSlug]'
auth: 'Public'
---

# BlogArticlePage

Route: `/[locale]/blogs/[articleSlug]`
Kind: page (Next.js route convention file)
Rendering: Server (force-dynamic)
Auth: Public

Purpose:
Single article detail page rendered as an **article-style two-column layout**:
a main `<article>` column on the left (back link → title → meta row → cover
image → excerpt → Markdown body → author card) and a sidebar `<aside>` on the
right carrying the full list of published blog types (categories) and a
3-row related-articles mini list with thumbnails. Mirrors the layout used by
`ProductDetailPage` so both detail surfaces share the same chrome and feel.

Data:

- `getPublishedArticleBySlug(articleSlug, locale)` → full article incl. body,
  blog type slug/name, author name/role/avatar, `publishedAt`, `readMinutes`.
- `listRelatedArticles(articleSlug, locale)` → 3 related article summaries
  (sidebar; sliced to 3).
- `listPublishedBlogTypes(locale)` → all published `{slug, name}` blog types
  (sidebar Categories list). Tagged with `BLOG_TYPES_TAG` so admin mutations
  flush this read.
- The two list reads run in parallel via `Promise.all` after the article
  fetch.

Business Logic:

- `export const dynamic = 'force-dynamic'` — live with admin edits.
- `generateMetadata()` returns `title: "{article.title} — BACA"` +
  `description: article.excerpt`; fallback "Article — BACA" when slug is
  unknown.
- Calls `getPublishedArticleBySlug`; `notFound()` if falsy.
- **Centered container** (`mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12`).
  Two-column grid on `lg+` (`lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]`).
  Vertical `lg:border-r lg:border-line` rule separates article and sidebar;
  `min-w-0` on both columns prevents grid blowout from long titles/content.
- **Article column order**: back link "← All Articles" (forest, ChevronLeft)
  → `<h1>` title → meta row (formatted `publishedAt` + `|` + blog type name
  in `text-forest`) → cover image wrapped in `<MediaReveal>` (GSAP clip-path
  reveal on scroll, per project rule 6 — child is the `aspect-[16/10]
rounded-2xl border` `<img>`) → excerpt lead paragraph → article
  body via `<MarkdownContent>` → author card at the bottom (`border-t pt-8`,
  avatar / initials chip + name + role + read minutes).
- **Sidebar**: Categories `<ul>` with an "All Articles" link at the top, then
  every published `BlogType` (active one matched by `type.slug ===
article.blogType.slug`, rendered `font-medium text-forest`; siblings in
  `text-ink/80`). All entries link to `Route.Blogs` (the blogs list page is
  the canonical landing — type filtering happens there). Related articles
  follow as `<li>` rows with an 80×80 cover thumbnail (`<img>`), 2-line
  clamped title, and locale-formatted date.
- Author fallback: `authorName`/`authorRole` default to `DEFAULT_AUTHOR`
  ("BACA Team"). Avatar shows the uploaded image or a saffron initials circle.
- Date formatting via `formatPublishedDate(publishedAt, locale)` (locale-aware
  Intl, no dependency).

Renders:

- SiteHeader (`forceSolid` — page is on `bg-paper`, no dark hero) · forest
  accent stripe · two-column grid:
  - article: back link · h1 · meta · cover image · excerpt ·
    MarkdownContent body · author card
  - sidebar: Categories list (All Articles + each BlogType, active
    highlighted) · related-articles mini cards
- SiteFooter

i18n:
Namespace `blogsPage`. Keys used: `allArticles` (back link label + first
sidebar entry), `categoriesHeading` (sidebar Categories heading), `writtenBy`
(author card eyebrow), `minRead` (read-time unit), `related` (sidebar
related-articles heading). All keys are translated in every locale under
`messages/`.

Accessibility:

- `<article>` + `<aside>` give the page a semantic two-region structure.
- Back link is a real `<Link>` with text + decorative ChevronLeft.
- `min-w-0` on both grid columns prevents long words from forcing horizontal
  scroll.
- Sidebar thumbnails use empty alt (decorative — the title beside them is
  the accessible label).

Notes:

- Replaced the previous `MediaHero` (full-bleed dark cover with overlaid
  title) treatment with an inline cover image inside the article column —
  same article-style layout as `ProductDetailPage`. The full-width related
  articles grid is gone; related now lives in the sidebar as a 3-row mini
  list.
- `MediaHero` is no longer imported by this page; the component remains in
  use elsewhere. `MediaReveal` is still imported — it now wraps the inline
  cover image so the article hero animates in on scroll like every other
  content image in the site.
- `SiteHeader` switched from transparent (`<SiteHeader />`) to `forceSolid`
  because the page is now on `bg-paper` from the first frame — the
  transparent-over-dark treatment would be invisible. `main` carries
  `pt-header-base` to clear the fixed header.
- Category sidebar links currently land on the unfiltered `/blogs` grid —
  filtering by blog type happens via the filter pills on that page.
