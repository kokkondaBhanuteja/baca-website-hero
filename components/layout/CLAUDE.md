# components/layout/

Site chrome — fixed header and footer. Appear on every public route. Both header
and footer have a _grouping folder_ (`site-header/`, `site-footer/`) that holds
the parent component + each sub-component, with sub-components nested in their
own folders so the per-component convention applies all the way down.

```
site-header/                          (grouping + parent component)
  site-header.tsx                     Server shell — fetches top-3 products + top-3 articles
                                      and passes them to SiteHeaderClient.
  site-header.claude.md
  index.ts
  site-header-client/                 Client orchestrator: scroll state, mobile overlay,
                                      body-scroll lock, nav-item derivation.
  desktop-nav/                        Desktop nav row + hover dropdowns (stateless).
  mobile-menu/                        Full-screen overlay below `lg`; owns accordion state.
  nav-types.ts                        Shared NavLink / NavItem (small .ts, no folder).

site-footer/                          (grouping + parent component)
  site-footer.tsx                     Client — owns the [data-footer-reveal] GSAP driver.
  site-footer.claude.md
  index.ts
  footer-marquee/                     Tagline strip on the `.baca-marquee` CSS keyframe.
  footer-columns/                     Description + nav columns + certifications grid.
  footer-wordmark/                    Oversized ocean wordmark (wraps WordmarkSlideshow).
  footer-link/                        Hover-underline link primitive used by columns.
```

## Patterns

- **`forceSolid` prop on SiteHeader.** Home renders `<SiteHeader />` (transparent
  over hero, solid on scroll). Inner pages render `<SiteHeader forceSolid />`
  because they sit on `bg-paper` from the first frame — the transparent-over-dark
  treatment would be invisible.
- **Footer reveal selector.** The GSAP timeline in `site-footer.tsx` selects all
  elements inside the footer root that carry `[data-footer-reveal]`. Sub-components
  opt in by adding that attribute. The wordmark is intentionally NOT in the reveal
  pass — it shows immediately, and `WordmarkSlideshow` handles its own
  intersection-paused timeline.
- **Mobile menu lives outside the header.** Rendered as a sibling of `<header>`
  (not a child) so the scrolled header's `backdrop-filter` doesn't trap this
  fixed overlay.
- **Header → client split.** `site-header.tsx` (server) fetches DB; `site-header-client.tsx`
  (client) handles state + interactions. The `NavLink` type is re-exported from the
  client file so the server file keeps a single import path.
