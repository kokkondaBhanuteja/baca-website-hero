import {
  Award,
  BadgeCheck,
  Globe,
  Leaf,
  ShieldAlert,
  ShieldCheck,
  Stamp,
  Star,
  type LucideIcon,
} from 'lucide-react'

export interface CertConfig {
  /** Joins to `certifications.items.<key>.sub` in messages. */
  key: string
  /** Proper-noun mark — NOT translated. */
  name: string
  icon: LucideIcon
}

/**
 * The credentials an Indian spice/food exporter ships against. Each icon is
 * picked to evoke what the mark actually represents — food-safety shields for
 * FSSAI/HACCP, a leaf for the organic mark, a globe for the export-registry
 * APEDA, an award for the international ISO standard, religious-market marks
 * (Halal/Kosher) get a generic badge / star.
 */
export const CERTS: CertConfig[] = [
  { key: 'fssai', name: 'FSSAI', icon: ShieldCheck },
  { key: 'spicesBoard', name: 'Spices Board', icon: Stamp },
  { key: 'apeda', name: 'APEDA', icon: Globe },
  { key: 'iso22000', name: 'ISO 22000', icon: Award },
  { key: 'haccp', name: 'HACCP', icon: ShieldAlert },
  { key: 'indiaOrganic', name: 'India Organic', icon: Leaf },
  { key: 'halal', name: 'Halal', icon: BadgeCheck },
  { key: 'kosher', name: 'Kosher', icon: Star },
]
