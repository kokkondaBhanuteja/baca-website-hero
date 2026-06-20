---
kind: 'page'
name: 'NewBlogArticlePage'
file: 'app/(admin)/admin/(dashboard)/blog-articles/new/page.tsx'
exports:
  - 'NewBlogArticlePage'
imports_from: []
route: '/admin/blog-articles/new'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# NewBlogArticlePage

Route: `/admin/blog-articles/new`  
Kind: page (Next.js route convention file)  
Rendering: Server  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Create new blog article form. Renders BlogArticleForm client component with no initial data.

Data:

- _No external data sources_

Business Logic:

- Renders BlogArticleForm with no initial prop

Renders:

- Heading 'New article'
- BlogArticleForm component

Notes:
BlogArticleForm client component handles form state and POSTs to /api/blog-articles.
