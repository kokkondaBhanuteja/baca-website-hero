import {
  GitBranch,
  Microscope,
  Ship,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export interface WhyBacaItemConfig {
  /** Joins to `profilePage.whyBaca.items.<key>.{title,body}` in messages. */
  key: string
  icon: LucideIcon
}

/**
 * The four differentiators surfaced on the profile page's "Why BACA" section.
 * Icons are picked to evoke what each value actually means — branching tree
 * for traceability, microscope for lab quality, ship for logistics,
 * sparkles for the long-term partnership.
 */
export const WHY_BACA: WhyBacaItemConfig[] = [
  { key: 'traceability', icon: GitBranch },
  { key: 'quality', icon: Microscope },
  { key: 'logistics', icon: Ship },
  { key: 'partnership', icon: Sparkles },
]
