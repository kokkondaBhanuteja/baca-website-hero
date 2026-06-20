---
kind: 'component'
name: 'Reveal'
file: 'components/ui/reveal/reveal.tsx'
exports:
  - 'Reveal'
imports_from: []
---

# Reveal

Purpose:
IntersectionObserver fade-up wrapper: element becomes visible and animates in as it scrolls into view. Honors reduced motion; CSS class 'baca-reveal' drives the animation.

Used In:

- Certifications (items)
- GlobalPresence (items)
- Manifesto (sections)
- ProductPreview (items)
- FeaturedInsights (items)
- CtaBand
- PullQuote
- Certifications (intro)
- and many staggered lists

Props:

- children: ReactNode — content to wrap
- className?: string — additional Tailwind on the wrapper
- delay?: number — animation-delay in ms (default: 0)
- as?: 'div' | 'section' | 'li' | 'span' | 'figure' — HTML element type (default: 'div')

Business Logic:

- useRef + useState(visible) to track visibility
- IntersectionObserver with threshold: 0.15, rootMargin: '0px 0px -8% 0px' — triggers when element is 15% visible (with 8% bottom margin to offset)
- On intersect: setVisible(true) and observer.disconnect()
- className: `baca-reveal ${visible ? 'is-visible' : ''} ${className}`
- style.animationDelay set to `${delay}ms` for stagger effects
- Element type determined by as prop via createElement()

Dependencies:

- React hooks: createElement, useEffect, useRef, useState
- IntersectionObserver API

i18n:
None

Accessibility:
Adds no a11y. The content inside must be semantic.

Notes:
The CSS animation is defined in globals.css as .baca-reveal (typically fade-up). delay prop allows stagger when wrapping multiple items in a loop. Very lightweight — no GSAP, just CSS animation triggered by .is-visible class.
