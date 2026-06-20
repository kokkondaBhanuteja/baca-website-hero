---
kind: 'component'
name: 'MediaReveal'
file: 'components/ui/media-reveal/media-reveal.tsx'
exports:
  - 'MediaReveal'
imports_from:
  - 'gsap'
  - 'gsap/ScrollTrigger'
  - '@/lib/utils'
---

# MediaReveal

Purpose:
GSAP scroll-reveal: image container unmasks with clip-path wipe + fade as it enters the viewport. Hidden initial state is inline (no flash on load); reduced motion shows immediately.

Used In:

- FeaturedInsights (article cover images)
- ProductPreview (category images)
- Blogs page (article list images)
- Blog detail page (article cover)
- Products page (product images)
- Gallery page (gallery images)

Props:

- children: ReactNode — the image container (typically <img> or a div with a background)
- className?: string — outer div Tailwind classes (e.g., rounded-2xl border)

Business Logic:

- useEffect: checks (prefers-reduced-motion: reduce). If true, set clipPath='none' + opacity=1 and return
- If motion allowed: gsap.to() animates clipPath from 'inset(0 0 100% 0)' (fully hidden bottom) to 'inset(0 0 0% 0)' (fully visible) + opacity 0→1, duration 1.1s, ease 'power3.out'
- ScrollTrigger configured with start: 'top 90%' (reveal when element's top is 90% down viewport)
- On unmount or if ref changes: scrollTrigger.kill() + tween.kill() cleanup
- Initial inline styles: style={{clipPath: 'inset(0 0 100% 0)', opacity: 0}} prevent flash

Dependencies:

- React hooks: useEffect, useRef
- gsap + gsap/ScrollTrigger — scroll-driven animation
- @/lib/utils — cn()

i18n:
None

Accessibility:
The child content (typically an image) handles a11y (alt attribute, etc.). The wrapper adds no a11y.

Notes:
Requires GSAP library and ScrollTrigger plugin registered globally or here. The clip-path animation creates a smooth wipe-up effect (the bottom edge dissolves first). This is the standard wrap for all content images on the site.
