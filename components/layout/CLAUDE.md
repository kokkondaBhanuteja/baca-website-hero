# components/layout/

Site chrome — fixed header and footer. Appear on every public route. The header
has a _grouping folder_ (`site-header/`) that holds the parent component plus
each sub-component in its own folder. The footer is a single flat file (no
sub-components).

```
site-header/                          (grouping + parent component)
  site-header.tsx                     Server shell — fetches top-3 products + first 3 blog types
                                      and passes them to SiteHeaderClient.
  site-header.claude.md
  index.ts
  site-header-client/                 Client orchestrator: scroll state, mobile overlay,
                                      body-scroll lock, nav-item derivation.
  desktop-nav/                        Desktop nav row + hover dropdowns (stateless).
  mobile-menu/                        Full-screen overlay below `lg`; owns accordion state.
  nav-types.ts                        Shared NavLink / NavItem (small .ts, no folder).

site-footer/
  site-footer.tsx                     Client — flat in-file implementation.
                                      Builds 4 nav columns from i18n keys + Route/CONTACT/CERT_MARKS
                                      constants; renders <ContactStrip /> above the dark band.
  site-footer.claude.md
  index.ts
```

## Patterns

- **`forceSolid` prop on SiteHeader.** Home renders `<SiteHeader />` (transparent
  over hero, solid on scroll). Inner pages render `<SiteHeader forceSolid />`
  because they sit on `bg-paper` from the first frame — the transparent-over-dark
  treatment would be invisible.
- **Mobile menu lives outside the header.** Rendered as a sibling of `<header>`
  (not a child) so the scrolled header's `backdrop-filter` doesn't trap this
  fixed overlay.
- **Header → client split.** `site-header.tsx` (server) fetches DB; `site-header-client.tsx`
  (client) handles state + interactions. The `NavLink` type is re-exported from the
  client file so the server file keeps a single import path.
- **Footer is flat.** The earlier `FooterMarquee` / `FooterColumns` /
  `FooterWordmark` / `FooterLink` sub-components were removed; `site-footer.tsx`
  now constructs its column data inline from the `footer` i18n namespace.
