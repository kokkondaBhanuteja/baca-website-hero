---
kind: 'component'
name: 'BlogsFilter'
file: 'app/(site)/[locale]/blogs/blogs-filter/blogs-filter.tsx'
exports: ['BlogsFilter']
imports_from:
  - 'react'
  - 'next/navigation'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/shared/types/blog-dto'
  - '@/lib/shared/types/blog-type-dto'
  - '@/lib/shared/format-date'
  - '@/components/ui/media-reveal'
  - '@/lib/utils'
---

# BlogsFilter

Purpose: Client component for the `/blogs` page. Renders a pill/tab bar (All +
each published blog type) and a uniform 3-col article grid, filtering the
already-loaded `articles` instantly by `article.blogType.slug` via `useState`
(no reload). Featured articles show the "Featured" badge instead of the type.

Used In: `app/(site)/[locale]/blogs/page.tsx`.

Business Logic:

- Pills are `All` (`__all__` sentinel) + each published type. `All` shows every
  article; otherwise the grid filters by the selected `blogType.slug`.
- **The page defaults to the `All` tab.** Initial selection comes from the
  `?type=<slug>` search param (the header "Blogs" dropdown links here as
  `/blogs?type=<slug>`); unknown/absent → `All`. A setState-during-render sync
  re-applies the param on later navigations, while pill clicks update state
  instantly without touching the URL. (The nav dropdown lists types only — no
  "All articles" entry — so deep-links always land on a specific type.)
- Active pill uses `--saffron` accent; idle pills use `--line` border.
- Cards mirror the `ProductCard` design language: cover image (with a
  type/Featured badge overlay in the top-left of the cover, `bg-ink/85
text-paper`), then a cream info panel carrying the title, an italic
  clay-toned excerpt tagline, and a `<dl>` of two attribute rows —
  `published` (locale-formatted `publishedAt` via `formatPublishedDate`)
  and `readTime` (`readMinutes` + `minRead` unit). `bg-bone` fallback when
  the cover image is missing; the published row is omitted when
  `publishedAt` is null/invalid.
- Cards link to `${Route.Blogs}/${slug}` via the i18n `Link`; per-filter
  empty state when no match.

Props:

- `articles: BlogArticleSummaryDto[]`
- `types: BlogTypePublicDto[]`
- `locale: Locale` — passed in so the client can locale-format `publishedAt`
  via `formatPublishedDate` (both-sides-safe helper)
- `labels: { all, filterBy, minRead, featured, empty, published, readTime }`

Dependencies: MediaReveal (GSAP reveal), i18n `Link` (locale-prefixed), `cn`,
`useSearchParams` (next/navigation), `formatPublishedDate` (locale-aware Intl).
