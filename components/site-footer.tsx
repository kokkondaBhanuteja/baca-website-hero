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
      { label: 'Industry Insights', href: '/blogs' },
      { label: 'Certifications', href: '/products#compliance' },
      { label: 'Contact', href: '/contact' },
      { label: 'Request a catalogue', href: '/contact' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1340px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-medium text-paper">
                BACA
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-paper/55">
                Bharat Cargo
              </span>
            </div>
            <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-paper/65">
              Sourced from Indian soil. Trusted across the world. A modern Indian
              export house for spices, nuts, and fruits.
            </p>
            <address className="mt-6 not-italic text-[13px] leading-relaxed text-paper/55">
              2nd Floor, Spice Exchange, MG Road
              <br />
              Kochi, Kerala 682016, India
              <br />
              <a href="tel:+914841234567" className="hover:text-paper">
                +91 484 123 4567
              </a>{' '}
              ·{' '}
              <a href="mailto:trade@baca.export" className="hover:text-paper">
                trade@baca.export
              </a>
            </address>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav
              key={col.title}
              className="lg:col-span-2"
              aria-label={col.title}
            >
              <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/45">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-paper/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Credentials */}
          <div className="lg:col-span-1">
            <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/45">
              Certified
            </h3>
            <ul className="mt-4 space-y-2.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-paper/55">
              <li>ISO 22000</li>
              <li>HACCP</li>
              <li>FSSAI</li>
              <li>APEDA</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-paper/15 pt-6 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BACA · Bharat Cargo · Est. 2009</p>
          <p className="flex flex-wrap gap-4">
            <span>GST 32ABCDE1234F1Z5</span>
            <span>IEC 0912345678</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
