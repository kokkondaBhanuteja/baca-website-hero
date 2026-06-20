export interface RegionStat {
  /** Joins to `globalPresence.items.<key>` (label) in messages. */
  key: string
  /** Pre-formatted display value (number + unit) — not translated. */
  value: string
}

export const REGIONS: RegionStat[] = [
  { key: 'countries', value: '37' },
  { key: 'continents', value: '5' },
  { key: 'repeatRate', value: '90%' },
  { key: 'responseTime', value: '12h' },
]
