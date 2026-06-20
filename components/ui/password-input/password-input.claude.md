---
kind: 'component'
name: 'PasswordInput'
file: 'components/ui/password-input/password-input.tsx'
exports:
  - 'PasswordInput'
imports_from:
  - 'react'
  - 'lucide-react'
  - '@/lib/utils'
---

# PasswordInput

Purpose:
Reusable password input primitive with a show/hide eye toggle. Wraps a native input, switches `type` between `password` and `text`, and renders a button-controlled Eye / EyeOff icon at the trailing edge.

Used In:

- Admin login page (`app/(admin)/admin/login/page.tsx`)

Props:

- All standard `InputHTMLAttributes<HTMLInputElement>` except `type` (locked to password/text) and `className` (re-defined below).
- `className?: string` — applied to the **outer wrapper** (the `relative` div). Use this for layout (e.g. `mb-6`). This is intentional: putting layout margin on the input would inflate the relative wrapper's height and decentre the eye toggle.
- `inputClassName?: string` — applied to the **inner input**. Use only when you need to override input chrome (border / padding / bg). Rarely needed.
- `showLabel?: string` — accessible label for the toggle when password is hidden. Default `'Show password'`.
- `hideLabel?: string` — accessible label for the toggle when password is visible. Default `'Hide password'`.
- `id?: string` — when omitted, a stable `useId()` is generated and wired to `aria-controls` on the toggle.

Business Logic:

- Local `isVisible` boolean controls the input `type` (`'text'` vs `'password'`).
- Toggle button is `type="button"` (does not submit forms), has `aria-pressed={isVisible}`, `aria-label`, and `aria-controls={inputId}`.
- Toggle uses `tabIndex={-1}` so keyboard tab order goes input → submit (the toggle is reachable via the icon but not in the form's natural flow). Mouse / click users still use it.
- Input has `pe-10` to leave room for the icon button on the trailing side. Uses logical `end-2` so it mirrors correctly in RTL.
- Toggle button is positioned with `absolute end-2 inset-y-0 my-auto h-7 w-7` — `inset-y-0 my-auto` (not `top-1/2 -translate-y-1/2`) so the icon stays centred on the input itself, not on the wrapper's full height. This matters because the wrapper's height includes any consumer-supplied margin classes.
- `forwardRef` for native form-library integration.

Dependencies:

- react: useId, useState, forwardRef, InputHTMLAttributes
- lucide-react: Eye, EyeOff
- @/lib/utils: cn()

Accessibility:

- The eye toggle is a real `<button>` with an `aria-label`, `aria-pressed`, and `aria-controls`.
- `tabIndex={-1}` keeps it out of the tab order; the input remains the primary keyboard target.
- Focus ring on the toggle via `focus-visible:ring-2 ring-ink/40`.

Notes:

- This is a UI primitive (zero page copy). The toggle labels are passed in by the consumer for localization.
- Defaults to BACA design tokens: `bg-bone`, `border-line`, `text-ink`, `focus:border-ink`. Override via `className` if needed.
