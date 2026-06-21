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
  - 'next-intl/server'
  - 'next/navigation'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/shared/types/blog-dto'
  - '@/lib/shared/format-date'
  - '@/components/ui/media-reveal'
  - '@/components/shared/media-hero'
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
Single article detail page in a magazine layout: a full-bleed `MediaHero` (cover image with the
title overlaid) carrying an author byline + date + read-time meta row, then a lead excerpt, a
Markdown-rendered body, an author card, and a related-articles grid. notFound() if the slug is unknown.

Data:

- getPublishedArticleBySlug(articleSlug, locale) — full article incl. body + author (name/role/avatar)
- listRelatedArticles(articleSlug, locale) — 3 related article summaries

Business Logic:

- export const dynamic = 'force-dynamic'
- generateMetadata() fetches article and returns title/description; fallback if not found
- Calls getPublishedArticleBySlug(); notFound() if falsy
- Author: `authorName`/`authorRole` fall back to the `DEFAULT_AUTHOR` constant ("BACA Team"); avatar
  shows the image or an initials circle
- Date via `formatPublishedDate(publishedAt, locale)` (Intl, no dependency); read time from `readMinutes`
- Renders `article.body` via `<MarkdownContent>` (react-markdown + remark-gfm) — admins paste
  Markdown / a README; headings, lists, links, tables, code blocks render brand-styled. Plain-text
  bodies still render as paragraphs (backward compatible). XSS-safe (no raw HTML).
- Related articles section if related.length > 0

Renders:

- SiteHeader (transparent — dark hero)
- MediaHero (eyebrow = category, title overlaid, meta = author chip + date + read time)
- Back link to blogs list · lead excerpt · Markdown body (MarkdownContent) · author card
- Related articles grid (3 columns on md+, MediaReveal images)
- SiteFooter

Notes:
Uses the transparent `SiteHeader` (no `forceSolid`) so the nav floats over the dark hero. Body is
rendered as Markdown via the shared `MarkdownContent` component. Articles fetched in generateMetadata
and page render (two calls).
