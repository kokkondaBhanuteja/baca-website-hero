---
kind: 'component'
name: 'ContactStrip'
file: 'components/sections/contact/contact-strip/contact-strip.tsx'
exports:
  - 'ContactStrip'
imports_from:
  - '@/components/sections/contact/enquiry-form'
---

# ContactStrip

Purpose:
Pre-footer global section that wraps the shared `<EnquiryForm />` so every
public page has the contact form available right above the dark footer.
Deliberately minimal: no heading, no eyebrow, no channel list, no address — the
form's own internal "Send an enquiry" title is the only label. Other contact
surfaces (channels + address) live on `/contact` only.

Used In:

- `components/layout/site-footer/site-footer.tsx` — rendered as a fragment
  sibling above the `<footer>` whenever `hideContactStrip` is **not** set.
  `/contact` passes `hideContactStrip` because it already shows the full
  panel + same form above, and rendering this strip would duplicate the form.

Props:

- No props — client component (`'use client'`). It's client-side because its
  consumer `SiteFooter` is already a client component (GSAP reveals), and an
  async server component can't render inside a client component in App Router.
  Bundle impact is negligible — no state or effects of its own.

Business Logic:

- Pure layout wrapper. Renders a full-bleed **forest** (`bg-forest`, dark
  green) contrasting band so the enquiry form stands out from the light page
  content above. Inside: a centered, width-capped (`max-w-3xl mx-auto`) card on
  a slightly lighter `bg-forest/40` with a hairline `border-paper/15`. The
  `EnquiryForm` is rendered with `tone="dark"` (cream heading/labels, white
  inputs, centered saffron submit) so it reads correctly on the dark band.
- `EnquiryForm` is the same instance used on `/contact` (there with the default
  `tone="light"`) — single submit pipeline, single validation surface, single
  200-char counter. Each page navigation mounts a fresh form (state is
  per-instance).

Dependencies:

- `@/components/sections/contact/enquiry-form` — the shared form.

Accessibility:

- `<section aria-label="Send an enquiry">` so screen readers can name the
  landmark even though no visual heading is rendered.

Notes:

- This component used to include an info column (eyebrow + heading + channels
  - address). That was moved out per design: the user wanted the global
    pre-footer to be the form only, with the info column appearing only on
    `/contact`. If you want a heading or eyebrow back in the global strip, add
    it here — translations exist under the `contactStrip` namespace
    (`eyebrow`, `heading`, `subheading`, `officeTitle`, `channels.*`) and can be
    reused.
