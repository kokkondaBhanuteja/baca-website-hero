---
kind: 'layout'
name: 'AdminRootLayout'
file: 'app/(admin)/admin/layout.tsx'
exports:
  - 'metadata'
  - 'AdminRootLayout'
imports_from: []
---

# AdminRootLayout

Route: `n/a`  
Kind: layout (Next.js route convention file)  
Rendering: Server  
Auth: n/a

Purpose:
Root HTML document for the admin dashboard. English only (LTR), no next-intl provider. Loads Inter font and sets robots noindex.

Data:

- _No external data sources_

Business Logic:

- Metadata: title 'BACA Admin', robots { index: false, follow: false }
- HTML lang='en' dir='ltr' (hardcoded)
- Applies Inter CSS variable

Renders:

- children (admin routes)

Notes:
Second root layout (sibling to site layout). No i18n, no next-intl provider. Robots noindex prevents indexing.
