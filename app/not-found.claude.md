---
kind: 'not-found'
name: 'RootNotFound'
file: 'app/not-found.tsx'
exports:
  - 'RootNotFound'
  - 'default'
imports_from:
  - 'next/navigation'
route: 'app root catch-all (paths outside any locale segment)'
auth: 'Public'
---

# RootNotFound

Route: fires for unmatched paths that resolve **outside** any `[locale]` segment — typically when the user types `/login`, `/foo`, or any other top-level path that doesn't match a real route. Without this file Next.js falls back to its built-in default "404 — This page could not be found" wall.
Kind: not-found (Next.js convention file at the app root)
Rendering: Server
Auth: Public

Purpose:
Server-side **redirect to `/`** (home). Safety net for the rare case where a user lands on a top-level path that has no locale prefix and no matching route. The **rich, branded 404** still fires on every unmatched path _inside_ a locale (`/en/foo`, `/de/anything-bad`, `notFound()` calls in localised pages) via `app/(site)/[locale]/not-found.tsx` — that's the common case and looks beautiful. This file is the zero-error fallback for the uncommon root-level case.

Business Logic:

- Single line: `redirect('/')` — a 307 redirect to home.
- The user types `/login` (or any other unmatched root path) → this file fires → server-side 307 → browser lands on `/`.

Why a redirect to `/` and not rich JSX:

Three approaches were tried; only this one survives:

1. **Rich JSX with `<html>` + `<body>`** — caused a persistent dev-mode hydration mismatch because Next.js's `DefaultLayout` overlay injects another bare `<html>` + `<body>` wrapper, and `suppressHydrationWarning` doesn't suppress the structural mismatch (only attribute drift). Production would render fine, but the dev console warning is loud.
2. **Redirect to a non-existent path like `/404`** — caused an **infinite redirect loop**. `/404` is itself an unmatched root path that lands back here, redirecting forever.
3. **Redirect to `/` (home)** — current solution. No JSX, no dual `<html>`, no hydration mismatch, no loop. Trades 404 semantic on truly root-level unknown paths for zero errors. The localised 404 still handles everything inside a locale segment, which is where any reasonable user link ends up.

Renders:

- Nothing — `redirect()` throws the navigation before any JSX is produced.

Notes:

- The rich `(site)/[locale]/not-found.tsx` is unaffected — it still fires for any `notFound()` call inside a locale page and for any unmatched path with a locale prefix. To see it in action, hit something like `/en/something-bad` or `/de/foo`.
- If you ever add an `app/layout.tsx` (currently absent on purpose), this file can return JSX directly without the dual-html issue — at that point you can mirror the localised rich version here, English-only.
