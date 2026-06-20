---
kind: 'component'
name: 'Button'
file: 'components/ui/button/button.tsx'
exports:
  - 'Button'
  - 'buttonVariants'
imports_from:
  - '@base-ui/react/button'
  - 'class-variance-authority'
  - '@/lib/utils'
---

# Button

Purpose:
Base button primitive with CVA variants for size/style. Wraps @base-ui ButtonPrimitive with outline, disabled, aria-invalid, and focus-visible states.

Used In:

- Very rarely used directly in public; the project prefers semantic links and custom interactive elements. Used in admin forms (via button[type=submit]).

Props:

- className: string — additional Tailwind classes
- variant: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link' — style preset (default: 'default')
- size: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' — spacing/padding (default: 'default')
- ...props: ButtonPrimitive.Props — all other button attributes passed through

Business Logic:

- Composes class-variance-authority variants for size/style combinations
- focus-visible: border-ring + ring-3 ring-ring/50 for keyboard nav
- active:not-aria-[haspopup]:translate-y-px — inset press effect when not a dropdown
- aria-invalid:border-destructive + ring destructive/20 for validation error state
- disabled:pointer-events-none disabled:opacity-50 — no interaction, dimmed
- SVG children inherit: shrink-0, size-4 (or size-3/3.5 in smaller variants), no pointer-events
- Works as both text button and icon-only if slot=button-group data attribute is present

Dependencies:

- @base-ui/react/button — the underlying headless button
- class-variance-authority — CVA for variant composition
- @/lib/utils — cn() for class merging

i18n:
None — takes text via children

Accessibility:
Inherits all @base-ui button a11y (role=button, aria-\*, keyboard). focus-visible outline for keyboard users. aria-invalid for form validation feedback.

Notes:
This is a low-level primitive rarely used in public; forms use semantic HTML inputs + custom styling instead. SVG icon sizing is handled automatically based on the size prop.
