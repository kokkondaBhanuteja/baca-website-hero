import { Route } from '@/constants/routes'

export interface CategoryConfig {
  /** Joins to `productPreview.items.<key>` (title / alt / note) in messages. */
  key: string
  href: string
  image: string
}

export const CATEGORIES: CategoryConfig[] = [
  { key: 'spices', href: Route.Spices, image: '/images/cat-spices.jpg' },
  { key: 'nuts', href: Route.Nuts, image: '/images/cat-nuts.jpg' },
  { key: 'fruits', href: Route.Fruits, image: '/images/cat-fruits.jpg' },
]
