/**
 * Brand and legal constants. These are proper nouns / registration identifiers
 * and are intentionally NOT translated — they read the same in every locale.
 */
export const SITE = {
  brand: 'BACA',
  sub: 'Bharat Cargo',
  founded: 2009,
  gst: 'GST 32ABCDE1234F1Z5',
  iec: 'IEC 0912345678',
  /** Postal address kept in Latin script for international deliverability. */
  address: [
    '2nd Floor, Spice Exchange, MG Road',
    'Kochi, Kerala 682016, India',
  ],
} as const

/** Certification acronyms shown as proper-noun marks (the descriptive `sub` text is translated). */
export const CERT_MARKS = ['ISO 22000', 'HACCP', 'FSSAI', 'APEDA'] as const
