import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cn } from '@/lib/utils'

/**
 * Renders an article body written in Markdown (e.g. a pasted README) as
 * brand-styled content. Uses GitHub-flavored Markdown (tables, task lists,
 * strikethrough, autolinks). Raw HTML in the source is intentionally NOT
 * rendered (no `rehype-raw`), so admin-pasted Markdown is XSS-safe by default.
 *
 * Backward compatible: plain-text bodies (blank-line-separated paragraphs, the
 * old seed format) render as normal paragraphs.
 */

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mb-3 mt-10 font-heading text-3xl font-light leading-tight text-ink">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-10 font-heading text-2xl font-light leading-tight text-ink">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-8 font-heading text-xl font-light leading-snug text-ink">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-60">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="my-5">{children}</p>,
  a: ({ href, children }) => {
    const isExternal = Boolean(href && /^https?:\/\//.test(href))
    return (
      <a
        href={href}
        className="text-clay underline underline-offset-2 transition-colors hover:text-saffron"
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {children}
      </a>
    )
  },
  strong: ({ children }) => (
    <strong className="font-medium text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-5 list-disc space-y-1.5 ps-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-1.5 ps-5">{children}</ol>
  ),
  li: ({ children }) => <li className="ps-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-s-2 border-saffron ps-4 italic text-ink/70">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-line" />,
  code: ({ children }) => (
    <code className="rounded bg-bone px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-xl bg-ink p-4 text-[13px] leading-relaxed text-paper [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-paper">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-line bg-bone px-3 py-2 text-start font-medium text-ink">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-line px-3 py-2 text-ink/85">{children}</td>
  ),
  img: ({ src, alt }) =>
    typeof src === 'string' ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ''} className="my-6 w-full rounded-2xl" />
    ) : null,
}

export function MarkdownContent({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'text-[16px] leading-relaxed text-ink/85 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        className,
      )}
    >
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  )
}
