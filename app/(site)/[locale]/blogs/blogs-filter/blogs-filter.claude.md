---
kind: 'component'
name: 'BlogsFilter'
file: 'app/(site)/[locale]/blogs/blogs-filter/blogs-filter.tsx'
exports: ['BlogsFilter']
imports_from:
  - 'react'
  - 'next/navigation'
  - '@/constants/routes'
  - '@/i18n/navigation'
  - '@/lib/shared/types/blog-dto'
  - '@/lib/shared/types/blog-type-dto'
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

- `ALL` sentinel (`__all__`) shows everything; otherwise filters by `blogType.slug`.
- Initial selection comes from the `?type=<slug>` search param (the header "Blogs"
  dropdown links here as `/blogs?type=<slug>`); unknown/absent → ALL. A
  setState-during-render sync re-applies the param on later navigations, while
  pill clicks update state instantly without touching the URL.
- Active pill uses `--saffron` accent; idle pills use `--line` border.
- Cards link to `${Route.Blogs}/${slug}`; per-filter empty state when no match.

Dependencies: MediaReveal (GSAP reveal), i18n `Link` (locale-prefixed), `cn`,
`useSearchParams` (next/navigation).
