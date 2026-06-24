export interface CertConfig {
  /** Joins to `certifications.items.<key>` in messages. */
  key: string
  /** Proper-noun name — NOT translated. */
  name: string
  /** Short authority label — NOT translated. */
  authority: string
}

export const CERTS: CertConfig[] = [
  { key: 'fssai', name: 'FSSAI', authority: 'Central License' },
  { key: 'spicesBoard', name: 'Spices Board', authority: 'CRES · India' },
  { key: 'apeda', name: 'APEDA', authority: 'Export Registration' },
  { key: 'iso22000', name: 'ISO 22000', authority: 'Food Safety Mgmt' },
  { key: 'haccp', name: 'HACCP', authority: 'Hazard Control' },
  { key: 'halal', name: 'Halal', authority: 'Market Access' },
]
