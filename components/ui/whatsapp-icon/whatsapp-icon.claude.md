---
kind: 'component'
name: 'WhatsAppIcon'
file: 'components/ui/whatsapp-icon/whatsapp-icon.tsx'
exports:
  - 'WhatsAppIcon'
imports_from:
  - 'react'
---

# WhatsAppIcon

Purpose:
Single source of truth for the official WhatsApp brand glyph as an inline SVG.
`lucide-react` doesn't ship a WhatsApp icon, so the brand mark lives here in
one place — consumers import from `@/components/ui/whatsapp-icon` instead of
duplicating the SVG path.

Used In:

- `components/sections/whatsapp-fab/whatsapp-fab.tsx` — floating FAB on every
  public page.
- `app/(site)/[locale]/contact/page.tsx` — channel row (WhatsApp / "Message us").

Props:

- Accepts any `<svg>` prop via `ComponentProps<'svg'>` (className, aria-hidden,
  width/height, etc.). No required props.

Business Logic:

- Renders a fixed `viewBox="0 0 32 32"` path with `fill="currentColor"` so the
  consumer controls size + color via Tailwind utility classes (e.g.
  `className="h-5 w-5 text-forest"`).
- Pure presentational — no state, no effects, no translations.

Dependencies:

- `react` — `ComponentProps` type only.

Accessibility:

- Caller is expected to either provide an `aria-label` (when the icon stands
  alone as the only label) or pass `aria-hidden` (when the surrounding text
  already names the action). Both consumers today pair the icon with visible
  text + an `aria-label` on the wrapping `<a>`, so they pass `aria-hidden`.

Notes:

- If the brand mark ever needs swapping for the official WhatsApp logo variant
  (e.g. green-circle background), do it here once — no consumer changes.
