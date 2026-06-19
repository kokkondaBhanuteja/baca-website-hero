'use client'

import { ArrowUpRight, ArrowUp } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Products',
    links: [
      { label: 'Spices', href: '/products/spices' },
      { label: 'Nuts', href: '/products/nuts' },
      { label: 'Fruits', href: '/products/fruits' },
      { label: 'All categories', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Approach', href: '/about#approach' },
      { label: 'Management Team', href: '/about#team' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Insights', href: '/blogs' },
      { label: 'Certifications', href: '/products#compliance' },
      { label: 'Contact', href: '/contact' },
      { label: 'Request a catalogue', href: '/contact' },
    ],
  },
]

const MARQUEE = [
  'India, in every shipment',
  'Spices',
  'Nuts',
  'Fruits',
  'ISO 22000',
  'HACCP',
  'FSSAI',
  'APEDA',
]

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="relative inline-block w-fit text-[14px] text-paper/70 transition-colors hover:text-paper after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-saffron after:transition-all after:duration-300 hover:after:w-full"
    >
      {label}
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      {/* Tagline marquee */}
      <div className="overflow-hidden border-b border-paper/12 py-6">
        <div className="baca-marquee flex w-max items-center gap-10 whitespace-nowrap font-heading text-[clamp(1.25rem,2.4vw,2rem)] font-light text-paper/85">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m}
              <span className="h-1.5 w-1.5 rounded-full bg-saffron" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        {/* Big contact line */}
        <div className="flex flex-col gap-8 border-b border-paper/12 py-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-saffron">
              Let&apos;s talk
            </p>
            <a
              href="mailto:trade@baca.export"
              className="group inline-flex items-end gap-3 font-heading text-[clamp(1.85rem,5vw,3.5rem)] font-light leading-none tracking-[-0.02em] text-paper"
            >
              trade@baca.export
              <ArrowUpRight className="mb-1 h-7 w-7 text-saffron transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
          <a
            href="/contact"
            data-cursor="fill"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Start an enquiry
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Columns */}
        <div className="grid gap-x-8 gap-y-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-paper/65">
              Sourced from Indian soil. Trusted across the world. A modern Indian
              export house for spices, nuts, and fruits.
            </p>
            <address className="mt-6 not-italic text-[13px] leading-relaxed text-paper/55">
              2nd Floor, Spice Exchange, MG Road
              <br />
              Kochi, Kerala 682016, India
              <br />
              <a href="tel:+914841234567" className="transition-colors hover:text-paper">
                +91 484 123 4567
              </a>
            </address>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} className="lg:col-span-2" aria-label={col.title}>
              <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/40">
                {col.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-1">
            <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/40">
              Certified
            </h3>
            <ul className="mt-5 flex flex-col gap-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-paper/55">
              <li>ISO 22000</li>
              <li>HACCP</li>
              <li>FSSAI</li>
              <li>APEDA</li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div data-reveal className="border-t border-paper/12 pt-8">
          <div className="flex items-end justify-between gap-6">
            <span className="font-heading text-[clamp(4rem,21vw,16rem)] font-medium leading-[0.78] tracking-[-0.04em] text-paper">
              BACA
            </span>
            <span className="hidden whitespace-nowrap pb-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-paper/45 sm:block">
              Bharat Cargo · Est. 2009
            </span>
          </div>
        </div>

        {/* Legal + back to top */}
        <div className="mt-10 flex flex-col gap-4 border-t border-paper/12 py-7 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BACA · Bharat Cargo</p>
          <p className="flex flex-wrap gap-4">
            <span>GST 32ABCDE1234F1Z5</span>
            <span>IEC 0912345678</span>
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 text-paper/60 transition-colors hover:text-paper"
          >
            Back to top
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-paper/25 transition-colors group-hover:border-saffron">
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
