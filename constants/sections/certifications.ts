import { BadgeCheck, type LucideIcon } from 'lucide-react'

export interface CertConfig {
  /** Joins to `certifications.items.<key>.sub` in messages. */
  key: string
  /** Proper-noun mark — NOT translated. */
  name: string
  icon: LucideIcon
}

/** The credentials an Indian spice/food exporter ships against. */
export const CERTS: CertConfig[] = [
  { key: 'fssai', name: 'FSSAI', icon: BadgeCheck },
  { key: 'spicesBoard', name: 'Spices Board', icon: BadgeCheck },
  { key: 'apeda', name: 'APEDA', icon: BadgeCheck },
  { key: 'iso22000', name: 'ISO 22000', icon: BadgeCheck },
  { key: 'haccp', name: 'HACCP', icon: BadgeCheck },
  { key: 'indiaOrganic', name: 'India Organic', icon: BadgeCheck },
  { key: 'halal', name: 'Halal', icon: BadgeCheck },
  { key: 'kosher', name: 'Kosher', icon: BadgeCheck },
]
