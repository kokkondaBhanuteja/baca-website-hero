---
kind: 'component'
name: 'Eyebrow'
file: 'components/ui/eyebrow/eyebrow.tsx'
exports:
  - 'Eyebrow'
imports_from:
  - '@/lib/utils'
---

# Eyebrow

Purpose:
Repeated micro-label: saffron horizontal rule (6px wide) + upper-cased mono label. Used above every section heading.

Used In:

- Approach
- Certifications
- ProductPreview
- FeaturedInsights
- GlobalPresence
- Manifesto
- CtaBand
- Hero
- PageIntro
- Products page eyebrow
- and many section headers

Props:

- children: React.ReactNode — the label text (typically from translations)
- className?: string — additional Tailwind for color/margin/alignment
- ...props — spread to the <p>, e.g. data-reveal, aria-\* attributes

Business Logic:

- Renders <p> with flex items-center gap-3
- Saffron rule span (h-px w-6 bg-saffron) placed before text with aria-hidden
- font-mono text-[0.72rem] uppercase tracking-[0.2em] — tight, mono-spaced label
- className prop appended for tone/alignment customization (e.g., 'text-ink-60', 'justify-center')

Dependencies:

- @/lib/utils — cn()

i18n:
None — takes text via children; caller handles translation

Accessibility:
The saffron rule has aria-hidden. Text is semantic; no ARIA needed.

Notes:
Pure presentational. Often passed data-reveal to participate in scroll animations. The rule is always 6px and saffron; color/positioning changes via className on the parent.
