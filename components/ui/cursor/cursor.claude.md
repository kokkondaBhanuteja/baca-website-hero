---
kind: 'component'
name: 'Cursor'
file: 'components/ui/cursor/cursor.tsx'
exports:
  - 'Cursor'
imports_from: []
---

# Cursor

Purpose:
Desktop-only magnetic cursor: a saffron dot tracks the pointer instantly; a ring trails with easing and morphs to wrap buttons/data-cursor elements, filling them with saffron tint while hiding the dot.

Used In:

- Global — mounted once in app/(site)/[locale]/layout.tsx. Targets every button and [data-cursor] element on all public pages.

Props:

- No props — returns null. Pure side-effect component.

Business Logic:

- Checks media queries: (hover: hover) and (pointer: fine) — does NOT render on touch devices or coarse pointers
- Checks (prefers-reduced-motion: reduce) — on reduce-motion, position trail eases fully (tp=1) and size eases faster (ts=1)
- Creates two DOM divs (.baca-cursor-dot + .baca-cursor-ring) appended to body; body gets .baca-has-cursor class
- onMouseMove: dot follows mx/my instantly with translate(-50%, -50%)
- onMouseOver: detects closest button or [data-cursor='fill'] (fillSel='button, [data-cursor="fill"]') and adds .is-filled to ring; adds .is-active for plain links/inputs/labels/[role=button]
- RAF loop: ring position/size/radius lerp to target (button's rect or 34px circle) with lerp factors tp=0.25/1, ts=0.5/1 (scale eases faster). Dot opacity → 0 when target is filled.
- Target must remain in DOM (document.contains check) or resets
- Cleanup: cancelAnimationFrame, removeEventListeners, remove divs, remove .baca-has-cursor

Dependencies:

- React.useEffect — setup/teardown
- requestAnimationFrame — smooth trailing animation

i18n:
None — no text

Accessibility:
Decorative — no a11y impact. Visual-only enhancement for fine-pointer desktop users.

Notes:
Requires corresponding CSS (.baca-cursor-dot, .baca-cursor-ring, .baca-has-cursor, .is-filled, .is-active) and the body must NOT have an existing cursor-none/auto override. The ring morphing is calculated per-frame; if an element is removed mid-morph, the ring resets gracefully.
