---
kind: 'component'
name: 'SiteFooter'
file: 'components/layout/site-footer/site-footer.tsx'
exports:
  - 'SiteFooter'
imports_from:
  - 'gsap'
  - 'gsap/ScrollTrigger'
  - 'lucide-react'
  - 'next-intl'
  - '@/constants/contact'
  - '@/constants/routes'
  - '@/constants/site'
  - '@/i18n/navigation'
  - '@/components/layout/site-footer/footer-columns'
  - '@/components/layout/site-footer/footer-marquee'
  - '@/components/layout/site-footer/footer-wordmark'
---

# SiteFooter

Purpose:
Site-wide footer: orchestrates [data-footer-reveal] GSAP scroll animations, includes marquee + columns + wordmark + legal strip.

Used In:

- Every public page (app/(site)/[locale]/layout.tsx and all inner pages)

Props:

- No props — client component

Business Logic:

- useEffect: queries all [data-footer-reveal] elements, checks (prefers-reduced-motion: reduce)
- If reduce-motion: returns (no animation)
- If motion allowed: builds GSAP context, gsap.from() each element yPercent 16→0, autoAlpha 0→1, clipPath 'inset(0% 0% 100% 0%)' → 'inset(0% 0% 0%)', duration 1s, ease 'power3.out', ScrollTrigger start 'top 90%'
- On unmount: context.revert()
- Renders: FooterMarquee + ContactStatement + FooterColumns + FooterWordmark + Legal/Copyright strip
- Footer contact section has email link (href={CONTACT.emailHref}), CTA button to Route.Contact
- Legal: year from new Date().getFullYear(), SITE.brand + sub + GST + IEC display

Dependencies:

- React hooks: useEffect, useRef
- gsap + gsap/ScrollTrigger
- lucide-react: ArrowUp, ArrowUpRight
- next-intl: useTranslations
- @/constants/contact, @/constants/routes, @/constants/site
- @/i18n/navigation: Link
- @/components/layout/site-footer/\* subcomponents

i18n:
Namespace: 'footer'. Keys: 'marqueeItems' (array via t.raw), 'talkLabel', 'startEnquiry', 'backToTop'.

Accessibility:
Semantic links. Scroll animations do not impact a11y.

Notes:
The footer is present on every page. The [data-footer-reveal] selector allows sub-components to opt in to the scroll animation without coupling. The wordmark is intentionally NOT in the reveal pass (it shows immediately). Back-to-top button uses window.scrollTo() with smooth behavior.
