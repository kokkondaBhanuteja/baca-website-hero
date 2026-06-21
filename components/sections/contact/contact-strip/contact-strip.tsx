'use client'

import { EnquiryForm } from '@/components/sections/contact/enquiry-form'

/**
 * Pre-footer global section. Rendered by `SiteFooter` on every public page
 * EXCEPT `/contact` (which passes `hideContactStrip` because it already
 * displays the full unified panel with the same `<EnquiryForm />`). The strip
 * is intentionally minimal — the form's own internal `Send an enquiry`
 * heading provides the only framing.
 */
export function ContactStrip() {
  return (
    <section
      aria-label="Send an enquiry"
      className="border-t border-line bg-cream"
    >
      <div className="mx-auto max-w-content px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
        <div className="rounded-3xl border border-line bg-cream p-6 sm:p-8 lg:p-10">
          <EnquiryForm />
        </div>
      </div>
    </section>
  )
}
