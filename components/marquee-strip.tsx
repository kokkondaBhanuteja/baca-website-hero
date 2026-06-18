const ITEMS = [
  'Netherlands',
  'Cardamom',
  'United States',
  'ISO 22000',
  'United Arab Emirates',
  'Cashew W320',
  'Germany',
  'HACCP',
  'Saudi Arabia',
  'Turmeric',
  'United Kingdom',
  'FSSAI',
  'Singapore',
  'Alphonso Mango',
  'Vietnam',
  'APEDA',
  'Kenya',
  'Black Pepper',
  'Canada',
  'Spices Board India',
]

export function MarqueeStrip() {
  return (
    <section
      aria-label="Countries served, commodities, and certifications"
      className="overflow-hidden border-y border-line bg-cream py-4"
    >
      <div className="flex w-max baca-marquee">
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            className="flex shrink-0 items-center"
            aria-hidden={dup === 1}
          >
            {ITEMS.map((item, i) => (
              <li
                key={`${dup}-${item}`}
                className="flex items-center gap-6 px-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink/65"
              >
                {item}
                <span className="text-saffron" aria-hidden>
                  •
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
