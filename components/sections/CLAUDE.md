# components/sections/

Home and inner-page sections. **Every section lives in its own folder**
(`<name>/<name>.tsx` + `<name>/<name>.claude.md` + `<name>/index.ts`). Names map
to the namespace each section reads from in `messages/<locale>.json`.

```
hero/                   Home hero — eyebrow + headline + dual CTA + meta strip.
hero-entry/             Home-only GSAP entry timeline that staggers [data-hero-reveal] elements.
manifesto/              "Why we're here" block. Anchor #why-we-re-here.
approach/               4-pillar grid with scroll-triggered rule sweep. Anchor #approach.
product-preview/        DB-driven: lists categories via getCategoriesForLocale().
featured-insights/      DB-driven: top 3 published articles via listPublishedArticles().
certifications/         Static cert grid. Anchor #compliance.
global-presence/        Stat strip with parallax background.
stats-row/              Count-up tiles (intersection-triggered).
marquee-strip/          Scroll-velocity-reactive marquee (distinct from footer marquee).
cta-band/               Final CTA band above the footer.
pull-quote/             Single oversized editorial quote block.
whatsapp-fab/           Floating WhatsApp button (uses CONTACT.whatsappHref).
contact/                Grouping folder — contains contact-page sections:
  enquiry-form/         The public enquiry form (POST /api/enquiry).
  location-map/         Google Maps iframe pinned to SITE.address (no API key).
  contact-strip/        Pre-footer global wrapper around <EnquiryForm /> — rendered by SiteFooter.
profile/                Grouping folder — contains profile-page sections:
  who-we-are/           Editorial intro block.
  vision-mission/       Paired Vision + Mission cards.
  how-we-work/          4-step process grid (mirrors home Approach pattern).
  founders/             Founder cards (FOUNDERS constant + initials avatar fallback).
  why-baca/             4-up differentiator grid (WHY_BACA constant + lucide icons).
```

## Patterns

- **Server vs client.** Static sections that only render translated text are `async`
  Server Components and call `await getTranslations(ns)`. Anything with state, refs,
  IntersectionObservers, or GSAP is `'use client'` and uses `useTranslations(ns)`.
- **DB-driven sections** (`product-preview`, `featured-insights`) fetch via
  `lib/server/services/*` using `await getLocale()`. Each returns `null` on empty
  results so the page never shows a half-empty grid.
- **Reveal stagger delays** come from `@/constants/animations` (`REVEAL_STAGGER_MS.*`).
  Same for `STATS_COUNTUP_DURATION_MS`, `INTERSECTION_THRESHOLD.REVEAL`,
  `SCROLL_HEADER_THRESHOLD_PX`, `MARQUEE_LOOP_SECONDS`.
- **Per-component GSAP timeline tuning** intentionally stays inline — values describe
  one specific motion and don't share with other components.
- **Dynamic next-intl keys** cast as `t(\`items.${key}\` as Parameters<typeof t>[0])`.
- **Direction-aware styling** uses logical utilities (`ps/pe`, `ms/me`, `start/end`).
