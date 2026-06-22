---
kind: 'component'
name: 'EnquiryForm'
file: 'components/sections/contact/enquiry-form/enquiry-form.tsx'
exports:
  - 'EnquiryForm'
imports_from:
  - 'next-intl'
  - 'lucide-react'
  - '@/lib/api-client/axios-instance'
  - '@/lib/api-client/endpoints/enquiry-api'
---

# EnquiryForm

Purpose:
Public contact form: name, email, company, phone, message. Submits to POST /api/enquiry. Shows success message or field errors on response.

Used In:

- Contact page (app/(site)/[locale]/contact/page.tsx) — default `tone="light"`
- ContactStrip pre-footer band on every other public page — `tone="dark"`

Props:

- `tone?: 'light' | 'dark'` (default `'light'`). Controls the form's color
  treatment so the same form reads correctly on a light panel vs a dark
  contrasting band. `light`: dark heading/labels, start-aligned heading,
  end-aligned ink submit button (the `/contact` paper panel). `dark`: cream
  (`text-paper`) heading/labels, **centered** heading + subtitle, white inputs
  that pop against the band, **centered saffron** submit button (the forest
  ContactStrip band). Inputs stay white (`bg-paper`) in both tones; only label /
  heading / counter / asterisk colors and the submit/heading alignment switch.
  Required-field asterisk and the near-limit counter use `clay` on light,
  `saffron` on dark.

Business Logic:

- Local state: name, email, **country**, company, phone, message, status ('idle' | 'sending' | 'sent' | 'error'), error, fieldErrors. `country` is required (matches the server-side zod schema); company + phone stay optional but their labels no longer carry the "(optional)" decoration — the asterisk on required fields is what signals the difference now.
- onSubmit: prevents default, sets status 'sending', calls enquiryApi.submit({...}) → on success: status 'sent' + show success box, on error: reads apiError.message + .fieldErrors
- Success state: shows check icon + message in green box on paper background, form is hidden
- Error state: shows red error message box at top + field-level errors below each input
- Form header: h2 title + `form.subtitle` line ("We'll respond within 12 hours."). On `dark` tone the header is centered; on `light` it is start-aligned. No separator under it — the field grid provides its own rhythm
- Field + MessageField subcomponents: each manages its own input + label + error display
- Field: input type text/email/tel, paper bg on cream panel, aria-invalid, aria-describedby linked to error id. Accepts an optional `className` so a single field can span the grid (used for phone, which sits alone in the third row after name/email/country/company fill the first two rows).
- MessageField: textarea capped at 200 characters via `MESSAGE_MAX_LENGTH`. Renders a live `X / 200` counter in the label row (mono, tabular-nums; flips to clay color in the last 20 chars). The wrapper is `flex flex-1 flex-col` and the textarea is `flex-1 h-full resize-none` so it grows to absorb whatever vertical space is left in the cream column — eliminates the empty gap that used to sit between the textarea and the action row when the form column was stretched to match the contact column's height.
- Form layout: `flex h-full w-full flex-col` so the form fills the cream column it sits in (page wrapper is `flex`, items stretch via the parent grid). `mt-auto` on the action row pushes it to the bottom so the cream space never feels empty.
- Action row: `mt-auto pt-6 flex` — just the submit button. `justify-end` on `light` tone, `justify-center` on `dark`.
- Submit button: auto-width pill (NOT full-width — that read as oversized in design review), `rounded-full px-5 py-2.5 text-sm`, ArrowRight icon that nudges on hover. `light`: `bg-ink text-paper hover:bg-forest`. `dark`: `bg-saffron text-ink hover:bg-saffron/90`. Text changes 'Submit' → 'Submitting…' when status='sending', disabled during send; arrow hidden while sending.

Dependencies:

- React hooks: useId, useState
- lucide-react: Check, ArrowRight
- next-intl: useLocale, useTranslations
- @/lib/api-client/endpoints/enquiry-api: enquiryApi.submit
- @/lib/api-client/axios-instance: NormalizedApiError

i18n:
Namespace: 'contactPage.form'. Keys: 'title', 'subtitle', 'name', 'email', 'company', 'phone', 'message', 'messagePlaceholder', 'optional', 'submit', 'submitting', 'success', 'error'.

Accessibility:
Proper label-input association via htmlFor + id. aria-invalid for field errors. aria-describedby links error messages. Required fields marked with red asterisk.

Notes:
The Field and MessageField helpers are internal to this file (not exported). The form captures localeSent so the backend knows which locale the enquiry came from. No validation happens client-side; the API returns field-level errors (keys like 'name', 'email', 'message').
