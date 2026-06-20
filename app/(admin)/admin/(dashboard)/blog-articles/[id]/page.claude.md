---
kind: 'page'
name: 'EditBlogArticlePage'
file: 'app/(admin)/admin/(dashboard)/blog-articles/[id]/page.tsx'
exports:
  - 'dynamic'
  - 'EditBlogArticlePage'
  - 'default'
imports_from:
  - '@/lib/server/http/http-error'
  - '@/lib/server/services/blog-article-service'
route: '/admin/blog-articles/[id]'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# EditBlogArticlePage

Route: `/admin/blog-articles/[id]`  
Kind: page (Next.js route convention file)  
Rendering: Server (force-dynamic)  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Edit existing blog article. Fetches article (all locales), passes as initial data to BlogArticleForm. notFound() if not found.

Data:

- getArticleForAdmin(id) — single article with all localized fields

Business Logic:

- export const dynamic = 'force-dynamic'
- Catches HttpError 404 → notFound()
- Passes article as initial prop to BlogArticleForm

Renders:

- Heading 'Edit article'
- BlogArticleForm with initial={article}

Notes:
Server component fetches; client component (BlogArticleForm) handles updates via PATCH /api/blog-articles/{id}.
