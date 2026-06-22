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
      className="border-t border-forest/40 bg-forest"
    >
      <div className="mx-auto max-w-content px-5 py-[clamp(3rem,6vw,5rem)] sm:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-paper/15 bg-forest/40 p-6 shadow-[0_1px_0_rgba(255,255,255,0.06)] sm:p-8 lg:p-10">
          <EnquiryForm tone="dark" />
        </div>
      </div>
    </section>
  )
}
