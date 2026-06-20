---
kind: 'component'
name: 'AdminListSkeleton'
file: 'app/(admin)/admin/components/admin-list-skeleton/admin-list-skeleton.tsx'
exports:
  - 'AdminListSkeleton'
imports_from:
  - '@/components/ui/skeleton'
---

# AdminListSkeleton

Purpose:
The single generic loading skeleton for every admin dashboard page. Replaces what
used to be five near-identical `loading.tsx` files (products, categories,
blog-articles, enquiries, gallery) — now one file at `(dashboard)/loading.tsx`
renders this for _any_ dashboard route transition.

Used In:

- `app/(admin)/admin/(dashboard)/loading.tsx` (the only consumer)

Props:

- `rows?: number` — number of skeleton rows in the placeholder list. Defaults to 6.
- `withNewButton?: boolean` — render the "New …" button placeholder in the header row. Defaults to true.

Business Logic:

- Renders a header row with a title placeholder and an optional CTA placeholder.
- Renders a bordered card with `rows` skeleton rows, each laid out like a table row.
- Pure presentation — no state, no effects.

Dependencies:

- `@/components/ui/skeleton` (the animated `bg-bone` pulse primitive)

i18n:
None — admin is English-only and skeletons render no copy.

Accessibility:
Inherits `Skeleton`'s `aria-hidden` on every placeholder block.

Notes:
The same skeleton works for the gallery page too — the brief visual mismatch
between a table-shaped placeholder and the gallery's image grid lasts milliseconds
during navigation and is preferable to maintaining a second loading.tsx just for
the gallery. If a page ever needs a fundamentally different placeholder, add a
local `loading.tsx` at that route segment to override this one.
