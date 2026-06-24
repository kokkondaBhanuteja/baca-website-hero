export interface PillarConfig {
  /** Joins to `approach.pillars.<key>` (title / body) in messages. */
  key: string
  /** Display numeral — purely presentational, not translated. */
  n: string
}

export const PILLARS: PillarConfig[] = [
  { key: 'traceability', n: '01' },
  { key: 'labtesting', n: '02' },
  { key: 'grading', n: '03' },
  { key: 'documentation', n: '04' },
  { key: 'accountability', n: '05' },
]
