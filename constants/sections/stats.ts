export interface StatConfig {
  /** Joins to `stats.items.<key>` (label) in messages. */
  key: string
  value: number
  suffix?: string
  prefix?: string
}

export const STATS: StatConfig[] = [
  { key: 'years', value: 17 },
  { key: 'countries', value: 37 },
  { key: 'containers', value: 2400, suffix: '+' },
  { key: 'tonnes', value: 48000, suffix: 't' },
]
