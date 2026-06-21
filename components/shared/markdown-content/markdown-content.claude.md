---
kind: 'component'
name: 'MarkdownContent'
file: 'components/shared/markdown-content/markdown-content.tsx'
exports: ['MarkdownContent']
imports_from:
  - 'react-markdown'
  - 'remark-gfm'
  - '@/lib/utils'
---

# MarkdownContent

Purpose:
Renders a blog article body written in **Markdown** (e.g. a pasted README) as
brand-styled content. Server-renderable (no `'use client'`, no hooks) so the
article page — a Server Component — renders it at request time.

Used In:

- `app/(site)/[locale]/blogs/[articleSlug]/page.tsx` (article body)

Business Logic:

- `react-markdown` + `remark-gfm` (GitHub-flavored Markdown: tables, task lists,
  strikethrough, autolinks).
- A `components` map styles each element with the site's tokens (font-heading
  headings, `--clay` links, mono inline code, dark code blocks, saffron
  blockquote rule, bordered tables, rounded images).
- **Security:** raw HTML in the source is NOT rendered (no `rehype-raw`) → the
  React-element output is XSS-safe even though bodies are admin-authored.
- Markdown `# h1` is rendered as an `<h2>` (the page already has the article
  title as the visual h1).
- Backward compatible: plain-text bodies (blank-line-separated paragraphs, the
  old seed format) render as normal paragraphs.

Props:

- `content: string` — the Markdown source (already locale-resolved by the page)
- `className?: string` — extra classes on the wrapper (page passes top margin)

Dependencies: react-markdown, remark-gfm, cn.
