export interface FounderConfig {
  /** Joins to `profilePage.founders.items.<key>.{role,bio}` in messages. */
  key: string
  /** Proper-noun name — NOT translated. */
  name: string
  /** Optional avatar URL. When omitted, the section renders an initials chip. */
  imageUrl?: string
}

/**
 * The people who run BACA. Names are proper nouns (untranslated); role + bio
 * resolve from the `profilePage.founders.items.<key>` namespace in messages.
 * When `imageUrl` is omitted, the section falls back to an initials avatar
 * (matches the blog-author pattern used in /blogs/[articleSlug]).
 */
export const FOUNDERS: FounderConfig[] = [
  { key: 'founder1', name: 'Founder One' },
  { key: 'founder2', name: 'Founder Two' },
]
