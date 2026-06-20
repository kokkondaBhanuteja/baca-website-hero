---
kind: 'page'
name: 'BlogArticlesListPage'
file: 'app/(admin)/admin/(dashboard)/blog-articles/page.tsx'
exports:
  - 'dynamic'
  - 'BlogArticlesListPage'
  - 'default'
imports_from:
  - '@/lib/server/services/blog-article-service'
route: '/admin/blog-articles'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# BlogArticlesListPage

Route: `/admin/blog-articles`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Admin list of all blog articles. Displays table with title (EN), slug, category, publish status (PUBLISHED/DRAFT), featured badge, and edit/delete actions.

Data:

- listArticlesForAdmin() — all articles with title (LocalizedString), slug, category (enum), status (PUBLISHED/DRAFT), featured

Business Logic:

- export const dynamic = 'force-dynamic'
- Table: title.en (with featured badge if featured), slug, category (formatted), status, edit/delete
- Featured badge shows if article.featured is true

Renders:

- Heading 'Blog articles', New article button
- Table or empty message

Notes:
Category displayed as lowercase with underscores replaced by spaces. Featured badge is separate visual indicator.
