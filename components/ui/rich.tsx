import type { ReactNode } from 'react'

/**
 * Shared rich-text tag renderers for `t.rich(...)`. Keeps emphasis styling in
 * code while letting translators move the `<em>…</em>` span within a sentence.
 */
export const richTags = {
  em: (chunks: ReactNode) => <span className="italic text-saffron">{chunks}</span>,
}
