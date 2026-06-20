---
kind: 'component'
name: 'FooterMarquee'
file: 'components/layout/site-footer/footer-marquee/footer-marquee.tsx'
exports:
  - 'FooterMarquee'
imports_from: []
---

# FooterMarquee

Purpose:
Top strip of footer: localized taglines scrolling horizontally on CSS keyframe animation (baca-marquee).

Used In:

- SiteFooter — rendered at the top

Props:

- items: string[] — tagline strings (from t.raw('marqueeItems'))

Business Logic:

- Renders div overflow-hidden border-b border-paper/12 py-6
- Inner div class='baca-marquee' (CSS keyframe animation), flex w-max will-change-transform
- Duplicates items array twice ([...items, ...items]) for seamless loop
- Each item: span flex gap-10 with item text + saffron dot separator (aria-hidden)

Dependencies:

- CSS keyframe: .baca-marquee (defined in globals.css)

i18n:
Items passed as prop from parent; parent calls t.raw('marqueeItems')

Accessibility:
Dot separators aria-hidden. Items are plain text, no interactive elements.

Notes:
Uses CSS animation, not GSAP. The keyframe is global (.baca-marquee). The list is duplicated for seamlessness. This is the footer's tagline loop (distinct from MarqueeStrip which is on the home page and reacts to scroll velocity).
