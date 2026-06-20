export interface PillarConfig {
  /** Joins to `approach.pillars.<key>` (title / body) in messages. */
  key: string
  /** Display numeral — purely presentational, not translated. */
  n: string
}

export const PILLARS: PillarConfig[] = [
  { key: 'sourcing', n: '01' },
  { key: 'quality', n: '02' },
  { key: 'logistics', n: '03' },
  { key: 'partnership', n: '04' },
]
