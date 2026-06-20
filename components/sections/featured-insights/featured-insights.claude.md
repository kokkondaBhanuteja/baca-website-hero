---
kind: 'component'
name: 'FeaturedInsights'
file: 'components/sections/featured-insights/featured-insights.tsx'
exports:
  - 'FeaturedInsights'
imports_from:
  - 'lucide-react'
  - 'next-intl/server'
  - '@/constants/animations'
  - '@/constants/i18n'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/server/services/blog-article-service'
  - '@/lib/shared/types/blog-dto'
  - '@/components/ui/eyebrow'
  - '@/components/ui/media-reveal'
  - '@/components/ui/reveal'
---

# FeaturedInsights

Purpose:
DB-driven: fetches top 3 published blog articles and renders them in a 3-column card grid with cover, category badge, title, excerpt.

Used In:

- Home page — appears in the middle section

Props:

- No props — server component

Business Logic:

- Calls await getLocale() + await getTranslations('featuredInsights') + await getTranslations('blogsPage')
- Calls await listPublishedArticles(locale), slices [0, 3], returns null if empty
- Maps articles; each wrapped in Reveal with delay: index \* REVEAL_STAGGER_MS.INSIGHT
- Each article card: Link to Route.Blogs/${article.slug} with group class
- Cover: MediaReveal wrapper with img (or bone placeholder), border border-line rounded-2xl, scale-[1.06] on hover
- Metadata: category badge (rounded-full border border-line) or 'featured' label + read-minutes
- Title: h3 max-w-[28ch] font-heading text-xl font-light, hover:text-clay
- Excerpt: max-w-[36ch] text-[13px] text-ink-60

Dependencies:

- lucide-react: ArrowUpRight
- next-intl: getLocale, getTranslations
- @/constants/animations — REVEAL_STAGGER_MS
- @/constants/routes
- @/i18n/navigation: Link
- @/lib/server/services/blog-article-service: listPublishedArticles
- @/lib/shared/types/blog-dto: BLOG_CATEGORY_KEY
- @/components/ui/eyebrow, media-reveal, reveal

i18n:
Namespaces: 'featuredInsights' (eyebrow, heading, allArticles), 'blogsPage' (featured label, categories.\*, minRead). Dynamic category keys via BLOG_CATEGORY_KEY enum.

Accessibility:
Semantic links and headings. Images have alt or no alt if decorative.

Notes:
Returns null if no articles exist (count-agnostic). The cover image hover scale is duration-baca-fast ease-baca (custom Tailwind duration/easing). Category badges use BLOG_CATEGORY_KEY to map enum values to i18n keys.
