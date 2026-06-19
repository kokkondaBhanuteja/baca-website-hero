/**
 * Canonical internal hrefs — WITHOUT a locale prefix. The locale-aware `Link`
 * from `@/i18n/navigation` adds the prefix at render time, so a value like
 * `Route.Products` becomes `/de/products` under the German locale automatically.
 */
export enum Route {
  Home = '/',
  About = '/about',
  Products = '/products',
  Spices = '/products/spices',
  Nuts = '/products/nuts',
  Fruits = '/products/fruits',
  Blogs = '/blogs',
  MarketInsights = '/blogs/industry-insights',
  ImpactStories = '/blogs/impact-stories',
  CommunityEngagement = '/blogs/community-engagement',
  Gallery = '/gallery',
  Contact = '/contact',
}

/** In-page fragment anchors, composed onto a `Route` (e.g. `${Route.About}${Anchor.Approach}`). */
export enum Anchor {
  WhoWeAre = '#who-we-are',
  Vision = '#vision',
  Approach = '#approach',
  Team = '#team',
  Why = '#why',
  Brands = '#brands',
  Photos = '#photos',
  Videos = '#videos',
  Compliance = '#compliance',
}
