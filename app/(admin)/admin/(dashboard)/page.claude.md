---
kind: 'page'
name: 'AdminDashboardPage'
file: 'app/(admin)/admin/(dashboard)/page.tsx'
exports:
  - 'AdminDashboardPage'
  - 'default'
imports_from:
  - '@/lib/server/prisma'
route: '/admin'
auth: 'Admin-only (gated by parent (dashboard) layout)'
---

# AdminDashboardPage

Route: `/admin`  
Kind: page (Next.js route convention file)  
Rendering: Server  
Auth: Admin-only (gated by parent (dashboard) layout)

Purpose:
Dashboard overview with 4 count cards (Products, Blog articles, Gallery images, Enquiries). Fetches counts directly via prisma.

Data:

- prisma.product.count()
- prisma.blogArticle.count()
- prisma.galleryImage.count()
- prisma.enquiry.count()

Business Logic:

- Promise.all() fetches all 4 counts
- Renders 4 cards in 2-column grid (4-column on lg)
- Each card: count + label, links to /admin/{section}

Renders:

- Heading 'Dashboard', subtitle
- 4 count cards (Products, Blog articles, Gallery images, Enquiries)

Notes:
No client-side interactivity. Direct prisma queries for counts.
