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

- Contact page (app/(site)/[locale]/contact/page.tsx)

Props:

- No props — client component

Business Logic:

- Local state: name, email, company, phone, message, status ('idle' | 'sending' | 'sent' | 'error'), error, fieldErrors
- onSubmit: prevents default, sets status 'sending', calls enquiryApi.submit({...}) → on success: status 'sent' + show success box, on error: reads apiError.message + .fieldErrors
- Success state: shows check icon + message in green box, form is hidden
- Error state: shows red error message box at top + field-level errors below each input
- Field + MessageField subcomponents: each manages its own input + label + error display
- Field: input type text/email/tel, aria-invalid, aria-describedby linked to error id
- MessageField: textarea rows=5, required, same error wiring
- Submit button: text changes 'Submit' → 'Submitting…' when status='sending', disabled during send

Dependencies:

- React hooks: useId, useState
- lucide-react: Check
- next-intl: useLocale, useTranslations
- @/lib/api-client/endpoints/enquiry-api: enquiryApi.submit
- @/lib/api-client/axios-instance: NormalizedApiError

i18n:
Namespace: 'contactPage.form'. Keys: 'name', 'email', 'company', 'phone', 'message', 'messagePlaceholder', 'optional', 'submit', 'submitting', 'success', 'error'.

Accessibility:
Proper label-input association via htmlFor + id. aria-invalid for field errors. aria-describedby links error messages. Required fields marked with red asterisk.

Notes:
The Field and MessageField helpers are internal to this file (not exported). The form captures localeSent so the backend knows which locale the enquiry came from. No validation happens client-side; the API returns field-level errors (keys like 'name', 'email', 'message').
