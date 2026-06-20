---
kind: 'component'
name: 'FooterWordmark'
file: 'components/layout/site-footer/footer-wordmark/footer-wordmark.tsx'
exports:
  - 'FooterWordmark'
imports_from:
  - '@/constants/site'
  - '@/components/ui/wordmark-slideshow'
---

# FooterWordmark

Purpose:
Oversized ocean wordmark montage at the bottom of footer: wraps WordmarkSlideshow with 4 ocean images cycling. No tagline beneath — the previous `Est. {SITE.founded}` line was removed when `SITE.founded` was dropped from the brand constants.

Used In:

- SiteFooter — rendered before the legal strip

Props:

- No props — server component

Business Logic:

- Renders `border-t border-paper/12 pt-6` wrapper.
- `WordmarkSlideshow`: `text={SITE.brand}`, `images={FOOTER_WORDMARK_IMAGES}` (4 ocean photos), `align="left"`, `className="w-full"`.
- No text beneath — the wordmark stands alone as the visual attraction.
- The wordmark itself is NOT animated in the parent footer reveal (intentionally shows immediately); WordmarkSlideshow's own intersection observer manages its timeline.

Dependencies:

- @/constants/site — SITE.brand
- @/components/ui/wordmark-slideshow

i18n:
None — brand name comes from site constants.

Accessibility:
WordmarkSlideshow handles a11y (sr-only text, aria-hidden SVG)

Notes:
The images (FOOTER_WORDMARK_IMAGES) are ocean stills, creating a calming visual finish to the page. The wordmark is NOT affected by the parent footer's [data-footer-reveal] animation — it shows immediately, and the image cycling starts when the footer itself enters view (managed by WordmarkSlideshow's own IntersectionObserver).
