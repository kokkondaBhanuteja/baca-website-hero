# components/shared/

Cross-page reusables that don't fit `ui/` (pure primitives, no page copy) or
`sections/` (page-specific slabs).

```
page-intro/             Inner-page header — Eyebrow + oversized H1 + optional intro.
                        Used by every non-home page.
media-hero/             Full-bleed editorial hero (cover image + gradient + overlaid eyebrow/title +
                        meta slot). Shared by the product- and article-detail pages.
product-card/           Catalogue product card (image + name + summary) linking to /products/<slug>.
                        Used by the /products grid and the detail page's "Pairs naturally" grid.
seasonality-calendar/   12-month harvest/peak strip (locale-aware via Intl) on the product detail page.
markdown-content/       Renders an article body written in Markdown (react-markdown + remark-gfm),
                        brand-styled. Server-renderable; XSS-safe (no raw HTML). Used by the article-detail page.
```

Add new shared primitives here only when they're used by 2+ pages AND don't fit
elsewhere. Single-page primitives belong under that page's section folder.
