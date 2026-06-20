---
kind: 'error'
name: 'AdminError'
file: 'app/(admin)/admin/(dashboard)/error.tsx'
exports:
  - 'AdminError'
imports_from: []
---

# AdminError

Route: `n/a`  
Kind: error (Next.js route convention file)  
Rendering: Client  
Auth: n/a

Purpose:
Admin dashboard error boundary. Renders error message and retry button without disrupting admin shell.

Data:

- _No external data sources_

Business Logic:

- useEffect logs error
- Renders error alert card with retry button
- onClick reset calls React error boundary reset

Renders:

- Error heading and description
- Try again button

Notes:
Client component. Styled with clay/clay-30 colors (error theme).
