export interface PostConfig {
  /** Joins to `featuredInsights.items.<key>` (title / alt) in messages. */
  key: string
  href: string
  image: string
  /** Joins to `featuredInsights.categories.<categoryKey>` in messages. */
  categoryKey: string
  /** Pre-formatted publication date — not translated. */
  date: string
}

export const POSTS: PostConfig[] = [
  {
    key: 'cardamom',
    href: '/blogs/industry-insights/global-cardamom-demand-2026',
    image: '/images/insight-3.jpg',
    categoryKey: 'market',
    date: 'Mar 2026',
  },
  {
    key: 'processing',
    href: '/blogs/impact-stories/modern-processing-kerala',
    image: '/images/insight-2.jpg',
    categoryKey: 'impact',
    date: 'Feb 2026',
  },
  {
    key: 'freight',
    href: '/blogs/industry-insights/ocean-freight-trends-2026',
    image: '/images/insight-1.jpg',
    categoryKey: 'market',
    date: 'Jan 2026',
  },
]
